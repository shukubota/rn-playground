async function wait(ms: number) {
  return new Promise((rs, _) => {
    setTimeout(rs, ms);
  })
}
async function login() {
  await wait(1000);
  return;
}

export {
  login,
}
