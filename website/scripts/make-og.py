#!/usr/bin/env python3
"""Write public/og-default.png — 1200×630 blueprint card. Stdlib only."""
from __future__ import annotations

import struct
import zlib
from pathlib import Path

W, H = 1200, 630
NAVY = (11, 37, 69)
BLUE = (29, 78, 137)
ACTION = (26, 86, 219)
GRID = (201, 218, 240)
INK = (31, 41, 51)
WHITE = (255, 255, 255)
TINT = (238, 244, 251)

# 5×7 caps, bits packed left-to-right.
FONT = {
    "A": [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
    "B": [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
    "C": [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
    "D": [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
    "E": [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
    "F": [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
    "G": [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01110],
    "H": [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
    "I": [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
    "K": [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
    "L": [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
    "M": [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
    "N": [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
    "O": [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
    "P": [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
    "Q": [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
    "R": [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
    "S": [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
    "T": [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
    "U": [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
    "V": [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
    "W": [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
    "X": [0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b01010, 0b10001],
    "Y": [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
    "0": [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
    "1": [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
    "2": [0b01110, 0b10001, 0b00001, 0b00110, 0b01000, 0b10000, 0b11111],
    "4": [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
    "5": [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
    "7": [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
    " ": [0, 0, 0, 0, 0, 0, 0],
    "-": [0, 0, 0, 0b01110, 0, 0, 0],
    ".": [0, 0, 0, 0, 0, 0b00100, 0b00100],
    ",": [0, 0, 0, 0, 0, 0b00100, 0b01000],
    "&": [0b01100, 0b10010, 0b10100, 0b01000, 0b10101, 0b10010, 0b01101],
    "/": [0b00001, 0b00010, 0b00100, 0b00100, 0b01000, 0b10000, 0b10000],
}

px = [list(WHITE) for _ in range(W * H)]


def setp(x: int, y: int, c: tuple[int, int, int]) -> None:
    if 0 <= x < W and 0 <= y < H:
        i = y * W + x
        px[i][0], px[i][1], px[i][2] = c


def fill(x0: int, y0: int, x1: int, y1: int, c: tuple[int, int, int]) -> None:
    for y in range(y0, y1):
        for x in range(x0, x1):
            setp(x, y, c)


def glyph(ch: str, x: int, y: int, s: int, c: tuple[int, int, int]) -> int:
    bits = FONT.get(ch.upper(), FONT[" "])
    for row, rowbits in enumerate(bits):
        for col in range(5):
            if rowbits & (1 << (4 - col)):
                for dy in range(s):
                    for dx in range(s):
                        setp(x + col * s + dx, y + row * s + dy, c)
    return 6 * s


def text(s: str, x: int, y: int, scale: int, c: tuple[int, int, int]) -> None:
    cx = x
    for ch in s:
        if ch == " ":
            cx += 4 * scale
            continue
        cx += glyph(ch, cx, y, scale, c)


# Background + blueprint grid
fill(0, 0, W, H, TINT)
for x in range(0, W, 24):
    for y in range(H):
        setp(x, y, GRID)
for y in range(0, H, 24):
    for x in range(W):
        setp(x, y, GRID)
for x in range(0, W, 120):
    for y in range(H):
        setp(x, y, BLUE)
for y in range(0, H, 120):
    for x in range(W):
        setp(x, y, BLUE)

# Title block
fill(48, 48, 1152, 582, WHITE)
fill(48, 48, 56, 582, ACTION)
fill(48, 48, 1152, 56, NAVY)
fill(48, 574, 1152, 582, NAVY)

text("RK SPRINGS AND WIREFORMS", 88, 120, 5, NAVY)
text("PRECISION SPRINGS IN PUNE", 88, 220, 3, BLUE)
text("TORSION  DOUBLE TORSION  EXTENSION", 88, 320, 3, INK)
text("COMPRESSION AND WIRE FORMS", 88, 360, 3, INK)
text("WIRE 0.40-2.50 MM     QUOTE IN 24 HOURS", 88, 460, 3, ACTION)
text("A BRAND OF RK ENTERPRISES     SINCE 2017", 88, 520, 2, BLUE)


def chunk(tag: bytes, data: bytes) -> bytes:
    crc = zlib.crc32(tag + data) & 0xFFFFFFFF
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", crc)


raw = bytearray()
for y in range(H):
    raw.append(0)
    for x in range(W):
        raw.extend(px[y * W + x])

png = b"\x89PNG\r\n\x1a\n"
png += chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0))
png += chunk(b"IDAT", zlib.compress(bytes(raw), 9))
png += chunk(b"IEND", b"")

out = Path(__file__).resolve().parent.parent / "public" / "og-default.png"
out.write_bytes(png)
print(f"wrote {out} ({out.stat().st_size} bytes)")
