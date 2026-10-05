type AnyFn = (...args: any[]) => any;
const tween = { kill() {} };
const timeline: any = {
  fromTo(..._args: unknown[]) { return timeline; },
  from(..._args: unknown[]) { return timeline; },
  to(..._args: unknown[]) { return timeline; },
  kill() {},
};
type MediaContext = { conditions?: Record<string, boolean | undefined> };
type GsapShim = {
  registerPlugin(...plugins: unknown[]): void;
  context(callback: AnyFn, scope?: Element | null): { revert(): void };
  matchMedia(): {
    add(query: string | Record<string, string>, callback: (context: MediaContext) => unknown): unknown;
    revert(): void;
  };
  from(...args: unknown[]): typeof tween;
  fromTo(...args: unknown[]): typeof tween;
  to(...args: unknown[]): typeof tween;
  timeline(...args: unknown[]): typeof timeline;
  ticker: { add(...args: unknown[]): void; remove(...args: unknown[]): void; lagSmoothing(...args: unknown[]): void };
  utils: { toArray<T = HTMLElement>(selector: string, scope?: Element): T[] };
};
const gsap: GsapShim = {
  registerPlugin() {},
  context(fn: AnyFn) { fn(); return { revert() {} }; },
  matchMedia() {
    return {
      add(_query: string | Record<string, string>, fn: AnyFn) {
        return fn({ conditions: { reduced: false, compact: window.innerWidth < 768, wide: window.innerWidth >= 768 } }) || (() => {});
      },
      revert() {},
    };
  },
  from: (..._args: unknown[]) => tween,
  fromTo: (..._args: unknown[]) => tween,
  to: (..._args: unknown[]) => tween,
  timeline: () => timeline,
  ticker: { add() {}, remove() {}, lagSmoothing() {} },
  utils: { toArray: <T = HTMLElement>() => [] as T[] },
};
export const ScrollTrigger: any = { create: () => tween, update() {}, refresh() {} };
export default gsap;