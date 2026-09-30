type AnyFn = (...args: any[]) => any;
const tween = { kill() {} };
const gsap: any = {
  registerPlugin() {},
  context(fn: AnyFn) { fn(); return { revert() {} }; },
  matchMedia() { return { add(_query: string, fn: AnyFn) { return fn() || (() => {}); }, revert() {} }; },
  from: () => tween,
  fromTo: () => tween,
  to: () => tween,
  utils: { toArray: <T = HTMLElement>() => [] as T[] },
};
export const ScrollTrigger: any = { create: () => tween, update() {} };
export default gsap;