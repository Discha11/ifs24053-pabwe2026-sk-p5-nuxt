// src/hooks/useInput.test.ts
import { describe, it, expect } from "vitest";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("initializes with provided value", () => {
    const { value } = useInput("hello");
    expect(value.value).toBe("hello");
  });

  it("onValueChange updates the value", () => {
    const { value, onValueChange } = useInput("");
    onValueChange("new value");
    expect(value.value).toBe("new value");
  });

  it("reset restores the initial value", () => {
    const { value, onValueChange, reset } = useInput("initial");
    onValueChange("changed");
    expect(value.value).toBe("changed");
    reset();
    expect(value.value).toBe("initial");
  });

  it("works with numbers", () => {
    const { value, onValueChange } = useInput(0);
    onValueChange(42);
    expect(value.value).toBe(42);
  });

  it("works with booleans", () => {
    const { value, onValueChange, reset } = useInput(false);
    onValueChange(true);
    expect(value.value).toBe(true);
    reset();
    expect(value.value).toBe(false);
  });
});
