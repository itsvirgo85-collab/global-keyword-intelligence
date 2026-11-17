import { describe, it, expect } from "vitest";
import { classifyIntent, isQuestion, isLongTail, wordCount } from "../src/lib/intent";

describe("classifyIntent (rule-based — labelled as such in the UI)", () => {
  it("classifies how-to as informational", () => {
    expect(classifyIntent("how to form an llc")).toBe("informational");
  });
  it("classifies best/review as commercial", () => {
    expect(classifyIntent("best llc formation service")).toBe("commercial");
    expect(classifyIntent("service vs competitor review")).toBe("commercial");
  });
  it("classifies buy/price as transactional", () => {
    expect(classifyIntent("buy llc formation package")).toBe("transactional");
    expect(classifyIntent("llc cost price")).toBe("transactional");
  });
  it("classifies near me as local", () => {
    expect(classifyIntent("llc lawyer near me")).toBe("local");
  });
  it("classifies login as navigational", () => {
    expect(classifyIntent("acme login")).toBe("navigational");
  });
  it("classifies 'cost' as transactional, and a plain head term as informational", () => {
    expect(classifyIntent("llc cost")).toBe("transactional");
    expect(classifyIntent("llc formation")).toBe("informational");
  });
  it("handles German transactional terms", () => {
    expect(classifyIntent("krankenversicherung kosten")).toBe("transactional");
  });
});

describe("isQuestion / isLongTail / wordCount", () => {
  it("detects question keywords", () => {
    expect(isQuestion("what is an llc")).toBe(true);
    expect(isQuestion("llc cost")).toBe(false);
  });
  it("counts words and long-tail (4+)", () => {
    expect(wordCount("llc cost")).toBe(2);
    expect(isLongTail("how much does an llc cost")).toBe(true);
    expect(isLongTail("llc cost")).toBe(false);
  });
});
