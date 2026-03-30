#!/usr/bin/env python3

import json
import sys
from typing import Any


def shorten(value: Any, limit: int = 160) -> str:
    text = " ".join(str(value).split())
    if len(text) <= limit:
        return text
    return f"{text[: limit - 3]}..."


def flatten_tool_content(value: Any) -> str:
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        parts: list[str] = []
        for item in value:
            if isinstance(item, dict):
                if "text" in item:
                    parts.append(str(item["text"]))
                elif "content" in item:
                    parts.append(flatten_tool_content(item["content"]))
            else:
                parts.append(str(item))
        return " ".join(parts)
    if isinstance(value, dict):
        if "text" in value:
            return str(value["text"])
        if "content" in value:
            return flatten_tool_content(value["content"])
    return str(value)


def summarize_tool_input(data: dict[str, Any]) -> str:
    for key in ("description", "command", "file_path", "path", "pattern", "url", "prompt"):
        value = data.get(key)
        if value:
            return shorten(value)
    if "fields" in data and isinstance(data["fields"], list):
        return f"{len(data['fields'])} fields"
    if not data:
        return "running"
    return shorten(json.dumps(data, ensure_ascii=False))


def emit(prefix: str, text: str) -> None:
    if not text:
        return
    lines = text.splitlines() or [text]
    for index, line in enumerate(lines):
        current_prefix = prefix if index == 0 else " " * len(prefix)
        print(f"{current_prefix}{line}", flush=True)


tool_names: dict[str, str] = {}
last_text = ""
last_tool = ""

for raw_line in sys.stdin:
    line = raw_line.strip()
    if not line:
        continue

    try:
        payload = json.loads(line)
    except json.JSONDecodeError:
        emit("[ship] ", shorten(line))
        continue

    payload_type = payload.get("type")

    if payload_type == "system" and payload.get("subtype") == "init":
        session_id = payload.get("session_id", "unknown")
        model = payload.get("model", "unknown model")
        emit("[ship] ", f"Claude session {session_id} started with {model}.")
        continue

    if payload_type == "assistant":
        message = payload.get("message") or {}
        for item in message.get("content", []):
            item_type = item.get("type")
            if item_type == "text":
                text = item.get("text", "").strip()
                if text and text != last_text:
                    emit("[assistant] ", text)
                    last_text = text
            elif item_type == "tool_use":
                tool_id = item.get("id", "")
                tool_name = item.get("name", "tool")
                summary = summarize_tool_input(item.get("input") or {})
                marker = f"{tool_name}|{summary}"
                tool_names[tool_id] = tool_name
                if marker != last_tool:
                    emit("[tool] ", f"{tool_name}: {summary}")
                    last_tool = marker
        continue

    if payload_type == "user":
        message = payload.get("message") or {}
        for item in message.get("content", []):
            if item.get("type") != "tool_result":
                continue
            tool_name = tool_names.get(item.get("tool_use_id", ""), "tool")
            if item.get("is_error"):
                detail = shorten(flatten_tool_content(item.get("content")))
                emit("[tool] ", f"{tool_name} failed: {detail}")
            else:
                emit("[tool] ", f"{tool_name} completed.")
        continue

    if payload_type == "result":
        subtype = payload.get("subtype", "result")
        duration_ms = payload.get("duration_ms")
        result_text = str(payload.get("result", "")).strip()
        if subtype == "success":
            if duration_ms is not None:
                seconds = duration_ms / 1000
                emit("[ship] ", f"Claude finished successfully in {seconds:.1f}s.")
            else:
                emit("[ship] ", "Claude finished successfully.")
        else:
            emit("[ship] ", f"Claude finished with status: {subtype}.")
        if result_text and result_text != last_text:
            emit("[result] ", result_text)
        continue

    if payload_type == "error":
        emit("[ship] ", shorten(payload.get("message", "Claude reported an error.")))
