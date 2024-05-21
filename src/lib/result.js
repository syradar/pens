/**
 * Utility class for creating Result objects representing success or failure.
 */

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Result {
  static ok(value) {
    return {
      _type: "ok",
      ok: true,
      err: false,
      value,
    };
  }

  static err(error) {
    return {
      _type: "err",
      ok: false,
      err: true,
      error,
    };
  }
}
