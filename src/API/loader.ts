export const Loader = async () => {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isiPad = navigator.userAgent.match(/iPad/i) !== null;

  const isDesktop = window.innerWidth > 786;
  return { isStandalone: isStandalone, isDesktop: isDesktop, isiPad: isiPad };
};
