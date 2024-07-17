export const responseResult = (result: object, success: boolean, message: string) => {
  return {
    result,
    success,
    message,
  }
}
