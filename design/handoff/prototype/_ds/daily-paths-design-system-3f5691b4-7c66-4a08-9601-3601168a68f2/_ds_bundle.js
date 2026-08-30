/* @ds-bundle: {"format":4,"namespace":"DailyPathsDesignSystem_3f5691","components":[{"name":"EntryCard","sourcePath":"components/content/EntryCard.jsx"},{"name":"HeroCard","sourcePath":"components/content/HeroCard.jsx"},{"name":"PrayerCard","sourcePath":"components/content/PrayerCard.jsx"},{"name":"QuoteBlock","sourcePath":"components/content/QuoteBlock.jsx"},{"name":"RippleField","sourcePath":"components/content/RippleField.jsx"},{"name":"SpeakerCard","sourcePath":"components/content/SpeakerCard.jsx"},{"name":"ToolRow","sourcePath":"components/content/ToolRow.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Field","sourcePath":"components/core/Field.jsx"},{"name":"Input","sourcePath":"components/core/Field.jsx"},{"name":"DP_ICON_PATHS","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Pill","sourcePath":"components/core/Pill.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"AppHeader","sourcePath":"components/layout/AppHeader.jsx"},{"name":"CollectionLink","sourcePath":"components/layout/CollectionLink.jsx"},{"name":"PageTitle","sourcePath":"components/layout/PageTitle.jsx"},{"name":"SectionTitle","sourcePath":"components/layout/SectionTitle.jsx"},{"name":"TabBar","sourcePath":"components/layout/TabBar.jsx"}],"sourceHashes":{"components/content/EntryCard.jsx":"4f1d5add7186","components/content/HeroCard.jsx":"2d7c06601a56","components/content/PrayerCard.jsx":"3cc76eb19dc7","components/content/QuoteBlock.jsx":"c3aab47c6997","components/content/RippleField.jsx":"65544b312767","components/content/SpeakerCard.jsx":"0960eb73593d","components/content/ToolRow.jsx":"60333d2ac6be","components/core/Badge.jsx":"06ee2db41a54","components/core/Button.jsx":"eb89c21ef206","components/core/Card.jsx":"8ac9b34c1b84","components/core/Field.jsx":"49a18d4c560a","components/core/Icon.jsx":"8e0fb6d5e41c","components/core/Pill.jsx":"be5962329672","components/core/ProgressBar.jsx":"8fc1fbd89f4b","components/layout/AppHeader.jsx":"74b4b694edc0","components/layout/CollectionLink.jsx":"0303332d25eb","components/layout/PageTitle.jsx":"58324a410008","components/layout/SectionTitle.jsx":"c93610f1b929","components/layout/TabBar.jsx":"c6e3b9b23f37","ui_kits/app/NotebookScreen.jsx":"4601023a6d4d","ui_kits/app/Phone.jsx":"4199ad92a0fe","ui_kits/app/PrayersScreen.jsx":"c7c023dd6972","ui_kits/app/ReadingScreen.jsx":"a180a943bba6","ui_kits/app/SpeakersScreen.jsx":"eefca4a1456d","ui_kits/app/TodayScreen.jsx":"04af94ff1537","ui_kits/app/data.js":"2541fa23ad2b","ui_kits/website/HomePage.jsx":"ab8745a5c131","ui_kits/website/ReflectionPage.jsx":"ba6cffee9010","ui_kits/website/SiteChrome.jsx":"b820d8950e84","ui_kits/website/SpeakersPage.jsx":"3b17d17f48df","ui_kits/website/ToolsPage.jsx":"09f3aea9ecf1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DailyPathsDesignSystem_3f5691 = window.DailyPathsDesignSystem_3f5691 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/QuoteBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function QuoteBlock({
  children,
  attribution,
  glyph = true,
  align = "left",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("figure", _extends({
    style: {
      margin: 0,
      display: "flex",
      gap: "8px",
      alignItems: "flex-start",
      ...style
    }
  }, rest), glyph ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontFamily: "var(--dp-font-display)",
      fontWeight: 500,
      fontSize: "44px",
      lineHeight: "44px",
      marginTop: "-4px",
      color: "var(--border)"
    }
  }, "\u201C") : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      fontFamily: "var(--dp-font-reading)",
      fontSize: "var(--type-quote-size)",
      lineHeight: "var(--type-quote-lh)",
      color: "var(--text-primary)",
      textAlign: align
    }
  }, children), attribution ? /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: "10px",
      fontFamily: "var(--dp-font-body)",
      fontSize: "var(--type-caption-size)",
      letterSpacing: ".4px",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, attribution) : null));
}
Object.assign(__ds_scope, { QuoteBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/QuoteBlock.jsx", error: String((e && e.message) || e) }); }

// components/content/RippleField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const RIPPLES = [[50, .45], [80, .32], [110, .22], [140, .15], [170, .10], [200, .06]];
function RippleField({
  size = 400,
  color = "#FFFFFF",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 400 400",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      right: -size / 2,
      top: -size / 2,
      pointerEvents: "none",
      ...style
    }
  }, rest), RIPPLES.map(([r, o]) => /*#__PURE__*/React.createElement("circle", {
    key: r,
    cx: "200",
    cy: "200",
    r: r,
    stroke: color,
    strokeWidth: "0.75",
    fill: "none",
    opacity: o
  })));
}
Object.assign(__ds_scope, { RippleField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/RippleField.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  tone = "accent",
  icon,
  children,
  style,
  ...rest
}) {
  const tones = {
    accent: {
      background: "rgba(55,102,98,.14)",
      color: "var(--accent)"
    },
    danger: {
      background: "rgba(220,53,69,.08)",
      color: "var(--dp-danger)"
    },
    neutral: {
      background: "var(--surface-highest)",
      color: "var(--text-muted)"
    },
    terracotta: {
      background: "rgba(143,85,70,.10)",
      color: "var(--dp-terracotta)"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "3px 8px",
      borderRadius: "10px",
      fontFamily: "var(--dp-font-body)",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: ".3px",
      ...tones[tone],
      ...style
    }
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  minHeight: "var(--button-height)",
  padding: "0 var(--space-md)",
  borderRadius: "var(--radius)",
  border: "none",
  cursor: "pointer",
  fontFamily: "var(--dp-font-body)",
  fontSize: "var(--type-body-size)",
  fontWeight: 600,
  letterSpacing: "var(--type-body-ls)",
  lineHeight: 1,
  transition: "filter var(--dur) var(--ease), transform var(--dur-fast) var(--ease), background-color var(--dur) var(--ease)"
};
const variants = {
  primary: {
    background: "var(--hero-gradient)",
    color: "#FFFFFF"
  },
  secondary: {
    background: "var(--accent-soft)",
    color: "var(--dp-teal-700)"
  },
  tertiary: {
    background: "var(--dp-terracotta-light)",
    color: "#3E2218"
  },
  ghost: {
    background: "transparent",
    color: "var(--accent)",
    boxShadow: "inset 0 0 0 1px var(--border-soft)"
  }
};
function Button({
  variant = "primary",
  size = "md",
  icon,
  disabled,
  full,
  children,
  style,
  ...rest
}) {
  const sizing = size === "sm" ? {
    minHeight: "40px",
    fontSize: "var(--type-body-small-size)",
    padding: "0 14px"
  } : size === "lg" ? {
    minHeight: "58px",
    padding: "0 28px"
  } : null;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    style: {
      ...base,
      ...variants[variant],
      ...sizing,
      width: full ? "100%" : undefined,
      opacity: disabled ? 0.55 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = "translateY(1px)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "none";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.filter = "none";
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.filter = "brightness(1.06)";
    }
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  lowest: "var(--surface-lowest)",
  low: "var(--surface-low)",
  base: "var(--surface-card)",
  high: "var(--surface-high)",
  highest: "var(--surface-highest)"
};
function Card({
  tone = "base",
  elevated = false,
  padding = "var(--space-lg-plus)",
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: tones[tone] || tones.base,
      borderRadius: elevated ? "var(--radius-card)" : "var(--radius-lg)",
      border: elevated ? "0.5px solid var(--border-card)" : "none",
      boxShadow: elevated ? "var(--shadow-surface)" : "none",
      padding,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Field({
  icon,
  trailing,
  focused,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: "var(--dp-field)",
      borderRadius: "var(--radius)",
      padding: "8px 10px",
      border: focused ? "2px solid var(--accent-strong)" : "1px solid var(--ghost-border)",
      ...style
    }
  }, rest), icon, children, trailing);
}
function Input({
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    style: {
      flex: 1,
      minWidth: 0,
      border: "none",
      background: "transparent",
      outline: "none",
      fontFamily: "var(--dp-font-body)",
      fontSize: "var(--type-body-small-size)",
      color: "var(--text-primary)",
      padding: 0,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Field, Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Field.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DP_ICON_PATHS = {
  feather: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M26 4c-8 2-12 8-14 16l-4 8 8-4c8-2 14-6 16-14",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 20L26 4",
    strokeWidth: "1.6"
  })),
  seedling: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M16 28V16",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 16c0-6 6-10 12-8-2 6-6 8-12 8Z",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 20c0-5-5-8-10-7 1.5 5 5 7 10 7Z",
    strokeWidth: "1.8"
  })),
  softExhale: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M6 16c4-6 8-6 10-3s6 3 10-3",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 22c3-4 6-4 8-2s5 2 8-2",
    strokeWidth: "1.8",
    opacity: "0.55"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 27c2-3 4-3 6-1.5s4 1.5 6-1.5",
    strokeWidth: "1.8",
    opacity: "0.3"
  })),
  moonOnWater: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M14 5a5.5 5.5 0 0 0 8.5 6.5 7 7 0 1 1-8.5-6.5Z",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 25c3-1.5 5.5 0 8.5-1s5-1.5 7.5 0",
    strokeWidth: "1.8",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 28.5c4-1.5 6 0 10-1s6-1.5 10 0",
    strokeWidth: "1.8",
    opacity: "0.3"
  })),
  lightOnWater: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "14",
    r: "4",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 7V5",
    strokeWidth: "1.4",
    opacity: "0.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21.5 9l1.5-1.5",
    strokeWidth: "1.6",
    opacity: "0.45"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.5 9l-1.5-1.5",
    strokeWidth: "1.6",
    opacity: "0.45"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M23 14h2",
    strokeWidth: "1.6",
    opacity: "0.35"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 14h2",
    strokeWidth: "1.6",
    opacity: "0.35"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 20c4-1.5 7 0 13-1s9-1.5 13 0",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 24c4-1 7 0 12-1s8-1 12 0",
    strokeWidth: "1.3",
    opacity: "0.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 27.5c3-.8 5 0 10-.8s7-.8 10 0",
    strokeWidth: "1.2",
    opacity: "0.2"
  })),
  leafOnWater: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 10c4-3 10-3 13 0-3 4-8 6-13 4Z",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 10c4 1 7 1 10 0",
    strokeWidth: "1.2",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 10c-1 2-2 4-2 6",
    strokeWidth: "1.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 20c3-1.5 6 0 10-1s7-1.5 10 0",
    strokeWidth: "1.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 24c4-1.5 7 0 12-1s8-1.5 12 0",
    strokeWidth: "1.4",
    opacity: "0.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 28c3-1 5 0 10-1s7-1 10 0",
    strokeWidth: "1.2",
    opacity: "0.25"
  })),
  stackedStones: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M16 4a2 2 0 1 1 0 4 2 2 0 1 1 0-4",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11.5 9a4.5 2.5 0 1 1 9 0 4.5 2.5 0 1 1-9 0",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.5 15a6.5 3 0 1 1 13 0 6.5 3 0 1 1-13 0",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 21.5a9 3.5 0 1 1 18 0 9 3.5 0 1 1-18 0",
    strokeWidth: "1.6"
  })),
  fourSquares: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "5",
    width: "9",
    height: "9",
    rx: "2.5",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "18",
    y: "5",
    width: "9",
    height: "9",
    rx: "2.5",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "18",
    width: "9",
    height: "9",
    rx: "2.5",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "18",
    y: "18",
    width: "9",
    height: "9",
    rx: "2.5",
    strokeWidth: "1.8"
  })),
  nautilus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M15 15.5a1.5 1.5 0 0 1 1.5 1.5 3 3 0 0 1-3 3 5 5 0 0 1-5-5 7.5 7.5 0 0 1 7.5-7.5 10.5 10.5 0 0 1 10.5 10.5c0 7-5.5 10-10.5 10",
    strokeWidth: "1.4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "15.5",
    r: "0.6",
    fill: "currentColor",
    strokeWidth: "1.4"
  })),
  microphone: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "11",
    y: "4",
    width: "10",
    height: "16",
    rx: "5",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 16c0 4.418 3.582 8 8 8s8-3.582 8-8",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 24v4",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 28h8",
    strokeWidth: "1.6"
  })),
  chevronRight: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M13 8l8 8-8 8",
    strokeWidth: "2"
  })),
  chevronDown: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M8 13l8 8 8-8",
    strokeWidth: "2"
  })),
  chevronLeft: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M19 8l-8 8 8 8",
    strokeWidth: "2"
  })),
  play: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 7.5l13 8.5-13 8.5z",
    strokeWidth: "1.8",
    strokeLinejoin: "round"
  })),
  search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "14.5",
    cy: "14.5",
    r: "7.5",
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 20l6 6",
    strokeWidth: "1.8"
  })),
  plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M16 7v18M7 16h18",
    strokeWidth: "2"
  })),
  bookmark: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M8 5h16v23l-8-6-8 6z",
    strokeWidth: "1.6"
  })),
  share: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "7",
    r: "3",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "16",
    r: "3",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "25",
    r: "3",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.6 14.6l10.8-6.2M10.6 17.4l10.8 6.2",
    strokeWidth: "1.6"
  })),
  book: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M5 6h9a3 3 0 0 1 3 3v17a3 3 0 0 0-3-3H5z",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M27 6h-9a3 3 0 0 0-3 3v17a3 3 0 0 1 3-3h9z",
    strokeWidth: "1.6"
  })),
  settings: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "16",
    cy: "16",
    r: "4",
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M25 7l-3 3M10 22l-3 3",
    strokeWidth: "1.6"
  }))
};
function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth,
  style,
  ...rest
}) {
  const paths = DP_ICON_PATHS[name];
  if (!paths) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: "block",
      flexShrink: 0,
      ...style
    },
    "aria-hidden": "true"
  }, rest), paths);
}
Object.assign(__ds_scope, { DP_ICON_PATHS, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/content/EntryCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TYPES = {
  journal: {
    label: "Journal",
    color: "var(--dp-journal)",
    icon: "feather"
  },
  gratitude: {
    label: "Gratitude",
    color: "var(--dp-gratitude)",
    icon: "seedling"
  },
  spot_check: {
    label: "Spot Check",
    color: "var(--dp-spot-check)",
    icon: "softExhale"
  },
  nightly_review: {
    label: "Nightly Review",
    color: "var(--dp-nightly)",
    icon: "moonOnWater"
  }
};
function EntryCard({
  type = "journal",
  time,
  preview,
  onClick,
  style,
  ...rest
}) {
  const t = TYPES[type] || TYPES.journal;
  return /*#__PURE__*/React.createElement("article", _extends({
    onClick: onClick,
    style: {
      background: "var(--surface-lowest)",
      borderRadius: "14px",
      borderLeft: "3.5px solid " + t.color,
      boxShadow: "var(--shadow-card)",
      padding: "16px",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: t.color
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.icon,
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontSize: "12px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: ".6px"
    }
  }, t.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontSize: "12px",
      color: "var(--text-muted)"
    }
  }, time)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontFamily: "var(--dp-font-body)",
      fontSize: "17px",
      lineHeight: 1.55,
      color: "#555555",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }
  }, preview));
}
Object.assign(__ds_scope, { EntryCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/EntryCard.jsx", error: String((e && e.message) || e) }); }

// components/content/HeroCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Split hero: image (or teal ripple field) over a white body. */
function HeroCard({
  image,
  teal = false,
  label,
  labelIcon,
  title,
  quote,
  quoteAttribution,
  footer,
  ctaLabel = "Read more",
  onClick,
  style,
  ...rest
}) {
  const topBg = teal ? "var(--accent)" : "url(" + image + ") center/cover no-repeat";
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-surface)",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: "var(--radius-lg)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      minHeight: teal ? 0 : "180px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      background: topBg
    }
  }, teal ? /*#__PURE__*/React.createElement(__ds_scope.RippleField, null) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: teal ? "20px" : "40px 20px 16px",
      background: teal ? "none" : "var(--scrim)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      marginBottom: "4px",
      color: "rgba(255,255,255,.73)"
    }
  }, labelIcon, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: "var(--type-label-size)",
      lineHeight: "var(--type-label-lh)",
      letterSpacing: ".4px",
      textTransform: "uppercase"
    }
  }, label)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 700,
      fontSize: "var(--type-h3-size)",
      lineHeight: "var(--type-h3-lh)",
      letterSpacing: "-0.3px",
      color: "#FFFFFF"
    }
  }, title))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-lowest)",
      padding: "var(--space-lg-plus)"
    }
  }, quote ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--dp-font-reading)",
      fontSize: "var(--type-body-size)",
      lineHeight: "var(--type-body-lh)",
      color: "var(--text-primary)",
      textAlign: quoteAttribution ? "left" : "center"
    }
  }, quoteAttribution ? quote : '"' + quote + '"') : null, footer || /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "2px",
      marginTop: "16px",
      color: "var(--accent)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 400,
      fontSize: "var(--type-label-size)",
      lineHeight: "var(--type-label-lh)"
    }
  }, ctaLabel), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevronRight",
    size: 18
  })))));
}
Object.assign(__ds_scope, { HeroCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/HeroCard.jsx", error: String((e && e.message) || e) }); }

// components/content/PrayerCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PrayerCard({
  name,
  text,
  expanded = false,
  onToggle,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--surface-lowest)",
      borderRadius: "14px",
      boxShadow: "var(--shadow-card)",
      padding: "16px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onToggle,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      width: "100%",
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "10px",
      background: "rgba(45,76,71,.06)",
      display: "grid",
      placeItems: "center",
      color: "var(--accent)",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "leafOnWater",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: "var(--dp-font-display)",
      fontWeight: 500,
      fontSize: "17px",
      color: "var(--text-primary)"
    }
  }, name), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: expanded ? "chevronDown" : "chevronRight",
    size: 16,
    color: "var(--text-muted)"
  })), expanded ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "14px",
      paddingTop: "14px",
      borderTop: "1px solid var(--rule)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      padding: "0 20px",
      fontFamily: "var(--dp-font-display)",
      fontStyle: "italic",
      fontSize: "18px",
      lineHeight: 1.7,
      color: "#555555",
      textAlign: "center",
      whiteSpace: "pre-line"
    }
  }, text)) : null);
}
Object.assign(__ds_scope, { PrayerCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/PrayerCard.jsx", error: String((e && e.message) || e) }); }

// components/content/SpeakerCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SpeakerCard({
  name,
  title,
  downloaded,
  explicit,
  nowPlaying,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      borderRadius: "var(--radius-card)",
      boxShadow: "var(--shadow-surface)",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      minHeight: "var(--tool-row-height)",
      background: "var(--surface-lowest)",
      border: "0.5px solid var(--border-soft)",
      borderRadius: "var(--radius-card)",
      paddingRight: "16px",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "90px",
      alignSelf: "stretch",
      display: "grid",
      placeItems: "center",
      background: "var(--accent)",
      marginRight: "16px",
      color: "#FFFFFF"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "microphone",
    size: 34
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: "3px",
      padding: "16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "8px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 500,
      fontSize: "17px",
      lineHeight: "22px",
      color: "var(--text-primary)"
    }
  }, name), nowPlaying ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: "10px",
      textTransform: "uppercase",
      letterSpacing: ".4px",
      color: "var(--text-muted)"
    }
  }, "Now Playing") : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 500,
      fontSize: "var(--type-body-small-size)",
      lineHeight: "var(--type-body-small-lh)",
      letterSpacing: "-0.1px",
      color: "var(--text-muted)"
    }
  }, title), downloaded || explicit ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "6px",
      marginTop: "6px"
    }
  }, explicit ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "danger"
  }, "E") : null, downloaded ? /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "accent"
  }, "Downloaded") : null) : null), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevronRight",
    size: 18,
    color: "var(--text-muted)"
  })));
}
Object.assign(__ds_scope, { SpeakerCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SpeakerCard.jsx", error: String((e && e.message) || e) }); }

// components/content/ToolRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Icon-pip list card: full-height teal pip on the left, text + Open CTA on the right. */
function ToolRow({
  icon,
  iconName,
  pipColor = "var(--accent)",
  title,
  description,
  ctaLabel = "Open",
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      borderRadius: "var(--radius-card)",
      boxShadow: "var(--shadow-surface)",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      minHeight: "var(--tool-row-height)",
      background: "var(--surface-lowest)",
      border: "0.5px solid var(--border-soft)",
      borderRadius: "var(--radius-card)",
      paddingRight: "16px",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "var(--icon-pip-width)",
      alignSelf: "stretch",
      display: "grid",
      placeItems: "center",
      background: pipColor,
      marginRight: "16px",
      color: "#FFFFFF"
    }
  }, icon || /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconName,
    size: 38
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: "3px",
      padding: "16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 500,
      fontSize: "17px",
      lineHeight: "22px",
      color: "var(--text-primary)"
    }
  }, title), description ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 500,
      fontSize: "var(--type-body-small-size)",
      lineHeight: "var(--type-body-small-lh)",
      color: "var(--text-muted)"
    }
  }, description) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "2px",
      color: "var(--accent)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontSize: "var(--type-label-size)",
      lineHeight: "var(--type-label-lh)"
    }
  }, ctaLabel), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevronRight",
    size: 18
  })))));
}
Object.assign(__ds_scope, { ToolRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ToolRow.jsx", error: String((e && e.message) || e) }); }

// components/core/Pill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Pill({
  selected = false,
  icon,
  children,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      minHeight: "var(--pill-height)",
      padding: "8px 12px",
      borderRadius: "var(--radius-pill)",
      cursor: "pointer",
      background: selected ? "var(--accent-soft)" : "var(--surface-highest)",
      border: selected ? "1px solid transparent" : "1px solid var(--ghost-border)",
      color: selected ? "var(--dp-teal-700)" : "var(--text-muted)",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: "var(--type-label-size)",
      lineHeight: "var(--type-label-lh)",
      letterSpacing: "var(--type-label-ls)",
      transition: "background var(--dur) var(--ease), color var(--dur) var(--ease)",
      ...style
    }
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Pill.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProgressBar({
  value = 0,
  style,
  ...rest
}) {
  const clamped = Math.max(0, Math.min(1, value));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      height: "4px",
      borderRadius: "var(--radius-pill)",
      background: "var(--accent-deep)",
      opacity: 0.25,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${clamped * 100}%`,
      borderRadius: "var(--radius-pill)",
      background: "var(--accent-strong)",
      opacity: 1
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/layout/AppHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Sub-page mode: back link + centered italic brand. Home mode: eyebrow over title. */
function AppHeader({
  title,
  eyebrow,
  brand = "Al-Anon Daily Paths",
  showBack = true,
  onBack,
  rightAction,
  style,
  ...rest
}) {
  const shell = {
    background: "var(--accent)",
    color: "#FFFFFF",
    padding: title ? "24px 20px 10px" : "12px 18px 16px",
    ...style
  };
  if (title) {
    return /*#__PURE__*/React.createElement("header", _extends({
      style: shell
    }, rest), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }
    }, showBack && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onBack,
      style: {
        width: 40,
        height: 40,
        display: "grid",
        placeItems: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#fff"
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevronLeft",
      size: 22
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, eyebrow && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--dp-font-display)",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: "15px",
        lineHeight: "20px",
        letterSpacing: ".2px",
        color: "rgba(255,255,255,.95)",
        marginBottom: "2px"
      }
    }, eyebrow), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--dp-font-body)",
        fontWeight: 600,
        fontSize: "24px",
        lineHeight: "30px",
        letterSpacing: "-0.2px"
      }
    }, title)), rightAction));
  }
  return /*#__PURE__*/React.createElement("header", _extends({
    style: shell
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      justifyContent: "flex-start"
    }
  }, showBack && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onBack,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "3px",
      padding: "6px 4px 3px",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "rgba(255,255,255,.75)",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 500,
      fontSize: "14px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevronLeft",
    size: 16
  }), "Back")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-display)",
      fontStyle: "italic",
      fontWeight: 600,
      fontSize: "var(--type-brand-size)",
      lineHeight: "var(--type-brand-lh)",
      color: "rgba(255,255,255,.95)",
      whiteSpace: "nowrap"
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      justifyContent: "flex-end"
    }
  }, rightAction)));
}
Object.assign(__ds_scope, { AppHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/AppHeader.jsx", error: String((e && e.message) || e) }); }

// components/layout/CollectionLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CollectionLink({
  metadata,
  label,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: "12px",
      padding: "2px var(--space-lg-plus)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 500,
      fontSize: "var(--type-caption-size)",
      lineHeight: "var(--type-caption-lh)",
      color: "var(--text-muted)",
      letterSpacing: 0
    }
  }, metadata || ""), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: "var(--type-body-small-size)",
      lineHeight: "var(--type-body-small-lh)",
      letterSpacing: ".1px",
      color: "var(--accent)"
    }
  }, label));
}
Object.assign(__ds_scope, { CollectionLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/CollectionLink.jsx", error: String((e && e.message) || e) }); }

// components/layout/PageTitle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PageTitle({
  title,
  subtitle,
  size = "md",
  style,
  ...rest
}) {
  const fontSize = size === "lg" ? 32 : 30;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      padding: "28px 22px 12px 28px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--dp-font-display)",
      fontWeight: 600,
      letterSpacing: "-0.3px",
      color: "var(--text-primary)",
      fontSize: `${fontSize}px`,
      lineHeight: `${Math.round(fontSize * 1.1)}px`
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "4px",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 400,
      fontSize: "13px",
      lineHeight: "18px",
      color: "var(--text-muted)"
    }
  }, subtitle));
}
Object.assign(__ds_scope, { PageTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/PageTitle.jsx", error: String((e && e.message) || e) }); }

// components/layout/SectionTitle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionTitle({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("h2", _extends({
    style: {
      margin: 0,
      padding: "0 var(--space-lg-plus)",
      fontFamily: "var(--dp-font-display)",
      fontWeight: 600,
      fontSize: "var(--type-section-title-size)",
      lineHeight: "var(--type-section-title-lh)",
      letterSpacing: "-0.1px",
      color: "var(--text-primary)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { SectionTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SectionTitle.jsx", error: String((e && e.message) || e) }); }

// components/layout/TabBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DEFAULT_TABS = [{
  id: "today",
  label: "Today",
  icon: "lightOnWater"
}, {
  id: "notebook",
  label: "Notebook",
  icon: "feather"
}, {
  id: "speakers",
  label: "Speakers",
  icon: "microphone"
}, {
  id: "prayers",
  label: "Prayers",
  icon: "leafOnWater"
}, {
  id: "settings",
  label: "Settings",
  icon: "stackedStones"
}];
function TabBar({
  tabs = DEFAULT_TABS,
  active,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: "flex",
      background: "var(--surface)",
      padding: "8px 0 10px",
      boxShadow: "0 -8px 24px rgba(25,28,28,.06)",
      ...style
    }
  }, rest), tabs.map(t => {
    const on = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      type: "button",
      onClick: () => onChange && onChange(t.id),
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2px 0",
        color: on ? "var(--accent)" : "var(--text-muted)",
        opacity: on ? 1 : 0.55
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: t.icon,
      size: 24,
      strokeWidth: on ? 1.8 : 1.6
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--dp-font-body)",
        fontWeight: 500,
        fontSize: "11px",
        lineHeight: "14px",
        letterSpacing: ".25px"
      }
    }, t.label));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/TabBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/NotebookScreen.jsx
try { (() => {
function NotebookScreen() {
  const {
    AppHeader,
    PageTitle,
    Pill,
    EntryCard,
    Icon
  } = window.DPS;
  const [filter, setFilter] = React.useState("all");
  const d = window.DPAppData;
  const filters = [{
    id: "all",
    label: "All"
  }, {
    id: "journal",
    icon: "feather",
    color: "var(--dp-journal)"
  }, {
    id: "gratitude",
    icon: "seedling",
    color: "var(--dp-gratitude)"
  }, {
    id: "spot_check",
    icon: "softExhale",
    color: "var(--dp-spot-check)"
  }, {
    id: "nightly_review",
    icon: "moonOnWater",
    color: "var(--dp-nightly)"
  }];
  const groups = d.entries.map(g => ({
    ...g,
    items: g.items.filter(i => filter === "all" || i.type === filter)
  })).filter(g => g.items.length);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    showBack: false,
    rightAction: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 20,
      color: "#fff"
    })
  }), /*#__PURE__*/React.createElement(PageTitle, {
    title: "Notebook",
    subtitle: "12 entries \xB7 4 day streak",
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      margin: "4px 16px 14px",
      padding: 4,
      background: "rgba(45,76,71,.06)",
      borderRadius: 999
    }
  }, filters.map(fl => {
    const on = fl.id === filter;
    return /*#__PURE__*/React.createElement("button", {
      key: fl.id,
      onClick: () => setFilter(fl.id),
      style: {
        flex: 1,
        height: 36,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        background: on ? "var(--surface-lowest)" : "transparent",
        boxShadow: on ? "var(--shadow-card)" : "none",
        color: on ? fl.color || "var(--accent)" : "#8A8A8A",
        fontFamily: "var(--dp-font-body)",
        fontWeight: 600,
        fontSize: 13
      }
    }, fl.icon ? /*#__PURE__*/React.createElement(Icon, {
      name: fl.icon,
      size: 18
    }) : fl.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "0 16px 90px"
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.day
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      margin: "14px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "rgba(45,76,71,.08)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontSize: 11,
      letterSpacing: "1px",
      textTransform: "uppercase",
      color: "#8A8A8A"
    }
  }, g.day), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "rgba(45,76,71,.08)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, g.items.map((i, n) => /*#__PURE__*/React.createElement(EntryCard, {
    key: n,
    type: i.type,
    time: i.time,
    preview: i.preview
  })))))), /*#__PURE__*/React.createElement("button", {
    style: {
      position: "absolute",
      right: 20,
      bottom: 20,
      width: 52,
      height: 52,
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      background: "var(--accent-strong)",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      boxShadow: "var(--shadow-fab)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 22
  })));
}
window.NotebookScreen = NotebookScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/NotebookScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Phone.jsx
try { (() => {
function Phone({
  children,
  tab,
  onTab
}) {
  const {
    TabBar
  } = window.DPS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 800,
      borderRadius: 42,
      background: "var(--surface)",
      boxShadow: "0 24px 60px rgba(25,28,28,.22)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      border: "8px solid #10201e"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--accent)",
      color: "#fff",
      font: "600 12px/1 var(--dp-font-body)",
      padding: "10px 22px 2px",
      display: "flex",
      justifyContent: "space-between",
      letterSpacing: ".4px"
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", null, "Daily Paths")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, children), /*#__PURE__*/React.createElement(TabBar, {
    active: tab,
    onChange: onTab
  }));
}
window.Phone = Phone;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Phone.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/PrayersScreen.jsx
try { (() => {
function PrayersScreen() {
  const {
    AppHeader,
    PageTitle,
    PrayerCard,
    Icon
  } = window.DPS;
  const [open, setOpen] = React.useState("Serenity Prayer");
  const d = window.DPAppData;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    showBack: false,
    rightAction: /*#__PURE__*/React.createElement(Icon, {
      name: "leafOnWater",
      size: 20,
      color: "#fff"
    })
  }), /*#__PURE__*/React.createElement(PageTitle, {
    title: "Prayers",
    subtitle: "A collection for your recovery journey",
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "0 16px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, d.prayers.map(p => /*#__PURE__*/React.createElement(PrayerCard, {
    key: p.name,
    name: p.name,
    text: p.text,
    expanded: open === p.name,
    onToggle: () => setOpen(open === p.name ? null : p.name)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-lowest)",
      borderRadius: 14,
      boxShadow: "var(--shadow-card)",
      padding: 16,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: "rgba(143,85,70,.10)",
      display: "grid",
      placeItems: "center",
      color: "var(--dp-terracotta)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "feather",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: "var(--dp-font-display)",
      fontWeight: 500,
      fontSize: 17
    }
  }, "Personal Prayer Notes"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 13,
      color: "var(--accent)"
    }
  }, "Edit")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 0 0",
      fontFamily: "var(--dp-font-display)",
      fontStyle: "italic",
      fontSize: 17,
      color: "var(--text-muted)"
    }
  }, "Tap edit to add your personal prayers\u2026"))));
}
window.PrayersScreen = PrayersScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/PrayersScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/ReadingScreen.jsx
try { (() => {
function ReadingScreen({
  onBack
}) {
  const {
    AppHeader,
    QuoteBlock,
    Icon,
    Card
  } = window.DPS;
  const r = window.DPAppData.reflection;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    onBack: onBack,
    rightAction: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        gap: 14,
        color: "#fff"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bookmark",
      size: 20
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "share",
      size: 20
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "0 24px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "24px 0 8px",
      fontFamily: "var(--dp-font-body)",
      fontSize: 15,
      color: "var(--text-muted)"
    }
  }, window.DPAppData.todayLabel), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "0 0 18px",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 300,
      fontSize: 36,
      lineHeight: "44px",
      letterSpacing: "-0.9px",
      color: "var(--text-primary)"
    }
  }, r.title), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--border-soft)",
      borderBottom: "1px solid var(--border-soft)",
      padding: "18px 0",
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(QuoteBlock, {
    attribution: r.quoteRef
  }, r.quote)), r.body.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      margin: "0 0 18px",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 500,
      fontSize: 19,
      lineHeight: "32px",
      letterSpacing: "-0.1px"
    }
  }, p)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: ".4px",
      textTransform: "uppercase",
      color: "var(--accent)",
      margin: "26px 0 8px"
    }
  }, "Practice"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--dp-font-body)",
      fontSize: 17,
      lineHeight: "26px"
    }
  }, r.practice), /*#__PURE__*/React.createElement(Card, {
    tone: "card",
    elevated: true,
    style: {
      marginTop: 26,
      padding: 20,
      background: "var(--surface-card)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 13,
      color: "var(--accent)",
      marginBottom: 6
    }
  }, "Thought for the Day"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 700,
      fontSize: 21,
      lineHeight: "27px",
      letterSpacing: "-0.2px"
    }
  }, r.thought), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: "var(--dp-font-body)",
      fontSize: 12,
      letterSpacing: ".4px",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, r.step))));
}
window.ReadingScreen = ReadingScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/ReadingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/SpeakersScreen.jsx
try { (() => {
function SpeakersScreen() {
  const {
    AppHeader,
    PageTitle,
    Field,
    Input,
    SpeakerCard,
    Card,
    Icon,
    ProgressBar
  } = window.DPS;
  const [q, setQ] = React.useState("");
  const [playing, setPlaying] = React.useState(null);
  const d = window.DPAppData;
  const list = d.speakers.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    showBack: false,
    rightAction: /*#__PURE__*/React.createElement(Icon, {
      name: "microphone",
      size: 20,
      color: "#fff"
    })
  }), /*#__PURE__*/React.createElement(PageTitle, {
    title: "Speakers",
    subtitle: d.speakers.length + " recordings · 3 new this week",
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px 12px"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    tone: "lowest",
    elevated: true,
    padding: "12px"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    style: {
      flex: 1
    },
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 18,
      color: "var(--accent)"
    })
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search speakers...",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "9px 12px",
      borderRadius: 10,
      border: "1px solid var(--rule)",
      background: "transparent",
      cursor: "pointer",
      color: "var(--accent)",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 12.5
    }
  }, "Newest", /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 12
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "0 16px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 24
    }
  }, list.map(s => /*#__PURE__*/React.createElement(SpeakerCard, {
    key: s.name,
    name: s.name,
    title: s.title,
    downloaded: s.downloaded,
    nowPlaying: playing === s.name,
    onClick: () => setPlaying(s.name)
  }))), playing && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-lowest)",
      borderTop: "0.5px solid var(--border-card)",
      padding: "12px 16px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      background: "var(--accent)",
      color: "#fff",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 15
    }
  }, playing), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontSize: 12,
      color: "var(--text-muted)"
    }
  }, "18:24 / 47:10"))), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 0.39
  })));
}
window.SpeakersScreen = SpeakersScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/SpeakersScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/TodayScreen.jsx
try { (() => {
function TodayScreen({
  onOpenReading,
  onTab
}) {
  const {
    AppHeader,
    SectionTitle,
    HeroCard,
    ToolRow,
    CollectionLink,
    Icon
  } = window.DPS;
  const d = window.DPAppData;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    title: d.todayLabel,
    eyebrow: "Al-Anon Daily Paths",
    showBack: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "24px 20px 20px",
      fontFamily: "var(--dp-font-display)",
      fontWeight: 500,
      fontSize: 36,
      lineHeight: "44px",
      letterSpacing: "-0.5px"
    }
  }, "Good morning"), /*#__PURE__*/React.createElement(HeroCard, {
    style: {
      margin: "0 16px"
    },
    image: d.reflection.image,
    label: "Today's Reflection",
    labelIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "book",
      size: 18
    }),
    title: d.reflection.title,
    quote: d.reflection.thought,
    onClick: onOpenReading
  }), /*#__PURE__*/React.createElement(SectionTitle, {
    style: {
      marginTop: 34,
      marginBottom: 20
    }
  }, "Daily Tools"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 24,
      padding: "0 16px"
    }
  }, d.tools.map(t => /*#__PURE__*/React.createElement(ToolRow, {
    key: t.id,
    iconName: t.icon,
    pipColor: t.color,
    title: t.label,
    description: t.description
  }))), /*#__PURE__*/React.createElement(CollectionLink, {
    style: {
      marginTop: 10
    },
    metadata: "12 entries \xB7 4 day streak",
    label: "Open your notebook \u2192",
    onClick: () => onTab("notebook")
  }), /*#__PURE__*/React.createElement(SectionTitle, {
    style: {
      marginTop: 22,
      marginBottom: 20
    }
  }, "Prayers"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px"
    }
  }, /*#__PURE__*/React.createElement(ToolRow, {
    iconName: "leafOnWater",
    title: "Your Prayers",
    description: "A collection of prayers \u2014 and a place to add your own.",
    onClick: () => onTab("prayers")
  })), /*#__PURE__*/React.createElement(SectionTitle, {
    style: {
      marginTop: 34,
      marginBottom: 20
    }
  }, "Speakers"), /*#__PURE__*/React.createElement(HeroCard, {
    style: {
      margin: "0 16px"
    },
    teal: true,
    label: "Featured Speaker",
    labelIcon: /*#__PURE__*/React.createElement(Icon, {
      name: "microphone",
      size: 18
    }),
    title: d.featured.title,
    quote: d.featured.quote,
    quoteAttribution: d.featured.name,
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 14,
        borderTop: "1px solid var(--rule)",
        paddingTop: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--dp-font-body)",
        fontWeight: 600,
        fontSize: 17
      }
    }, d.featured.name), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 2,
        color: "var(--accent)",
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "play",
      size: 18
    }), "Listen")),
    onClick: () => onTab("speakers")
  }), /*#__PURE__*/React.createElement(CollectionLink, {
    style: {
      marginTop: 10
    },
    metadata: "3 new this week",
    label: "Explore all speakers \u2192",
    onClick: () => onTab("speakers")
  })));
}
window.TodayScreen = TodayScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/TodayScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
window.DPAppData = {
  todayLabel: "Sunday, February 8, 2026",
  reflection: {
    title: "Letting Go of the Outcome",
    image: "../../assets/reflections/reflections-21.webp",
    thought: "I can be responsible for my effort and let go of the result.",
    quote: "Detachment is not caring less. It is caring without controlling.",
    quoteRef: "Courage to Change, p. 41",
    body: ["There was a time when I measured a good day by whether the people around me behaved the way I hoped they would. If my husband was cheerful, I was fine. If he was distant, my whole day tilted.", "Letting go of the outcome does not mean I stop caring. It means I stop auditing. I can make the phone call, say the honest thing, set the boundary — and then take my hands off the wheel of someone else's response.", "Today I get to do the footwork and leave the results where they have always belonged: not with me."],
    practice: "Name one situation you are trying to manage today. Say aloud: I can do my part and leave the rest.",
    step: "Step Three"
  },
  tools: [{
    id: "journal",
    label: "Journal",
    description: "Write freely about what's on your mind",
    icon: "feather",
    color: "var(--dp-journal)"
  }, {
    id: "gratitude",
    label: "Gratitude",
    description: "Count your blessings today",
    icon: "seedling",
    color: "var(--dp-gratitude)"
  }, {
    id: "spot_check",
    label: "Spot Check",
    description: "Work through what's happening right now",
    icon: "softExhale",
    color: "var(--dp-spot-check)"
  }, {
    id: "nightly_review",
    label: "Nightly Review",
    description: "Reflect on your day",
    icon: "moonOnWater",
    color: "var(--dp-nightly)"
  }],
  entries: [{
    day: "Today — Feb 8",
    items: [{
      type: "spot_check",
      time: "8:42 AM",
      preview: "Caught myself managing someone else's day again. Named the fear, took a breath, and did the next right thing instead."
    }, {
      type: "gratitude",
      time: "7:15 AM",
      preview: "Coffee before anyone else was awake. A text from my sponsor. The heater finally working."
    }]
  }, {
    day: "Yesterday — Feb 7",
    items: [{
      type: "nightly_review",
      time: "10:15 PM",
      preview: "Quieter than yesterday. I owe Sam a small amend for how I answered at dinner — I'll say something in the morning."
    }, {
      type: "journal",
      time: "6:02 PM",
      preview: "Writing this from the parking lot before the meeting. I don't want to go in and I know I'll be glad I did."
    }]
  }, {
    day: "Feb 6",
    items: [{
      type: "gratitude",
      time: "9:20 PM",
      preview: "A walk with the dog. My daughter called first. Nothing broke today."
    }]
  }],
  prayers: [{
    name: "Serenity Prayer",
    text: "God, grant me the serenity\nto accept the things I cannot change,\ncourage to change the things I can,\nand wisdom to know the difference."
  }, {
    name: "Serenity Prayer (Extended)",
    text: "Living one day at a time,\nenjoying one moment at a time,\naccepting hardship as a pathway to peace."
  }, {
    name: "Third Step Prayer",
    text: "I offer myself to Thee —\nto build with me and to do with me as Thou wilt."
  }, {
    name: "Seventh Step Prayer",
    text: "I am now willing that you should have all of me,\ngood and bad."
  }, {
    name: "Just for Today",
    text: "Just for today I will try to live through this day only,\nand not tackle my whole life problem at once."
  }],
  speakers: [{
    name: "Martha B.",
    title: "Boston Roundup, 2019",
    downloaded: true
  }, {
    name: "Ray K.",
    title: "Detachment and the daily reprieve",
    downloaded: false
  }, {
    name: "Dolores M.",
    title: "Spring Assembly — keynote",
    downloaded: true,
    explicit: false
  }, {
    name: "Frank T.",
    title: "What the Steps did for my marriage",
    downloaded: false
  }, {
    name: "Anne S.",
    title: "Sponsorship, honestly",
    downloaded: false
  }],
  featured: {
    name: "Martha B.",
    title: "Boston Roundup, 2019",
    quote: "I stopped waiting for everyone else to get well before I did."
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/website/HomePage.jsx
try { (() => {
function HomePage({
  onPage
}) {
  const {
    Button,
    Icon,
    RippleField,
    QuoteBlock,
    SpeakerCard,
    ToolRow
  } = window.DPS;
  const d = window.DPAppData;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      minHeight: 560,
      display: "flex",
      alignItems: "flex-end",
      backgroundImage: "url(../../assets/reflections/reflections-30.webp)",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg,rgba(28,37,36,.15) 0%,rgba(28,37,36,.78) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "0 32px 72px",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: ".4px",
      textTransform: "uppercase",
      color: "rgba(255,255,255,.72)"
    }
  }, "One day at a time"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "12px 0 0",
      maxWidth: 720,
      fontFamily: "var(--dp-font-display)",
      fontWeight: 500,
      fontSize: 68,
      lineHeight: "74px",
      letterSpacing: "-1px",
      color: "#fff"
    }
  }, "A quiet place to begin the day"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "18px 0 28px",
      maxWidth: 560,
      fontFamily: "var(--dp-font-reading)",
      fontSize: 20,
      lineHeight: "34px",
      color: "rgba(255,255,255,.88)"
    }
  }, "A daily reflection, four ways to write it down, hundreds of speaker recordings, and the prayers you already know by heart."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onPage("reflection")
  }, "Read today's reflection"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost",
    style: {
      color: "#fff",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,.5)"
    }
  }, "Get the app")))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "-56px auto 0",
      padding: "0 32px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.15fr 1fr",
      background: "var(--surface-lowest)",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "var(--shadow-ambient)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "44px 44px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: "var(--accent)",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: ".4px",
      textTransform: "uppercase"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book",
    size: 18
  }), "Today's Reflection \xB7 ", d.todayLabel), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "14px 0 18px",
      fontFamily: "var(--dp-font-display)",
      fontWeight: 600,
      fontSize: 42,
      lineHeight: "46px",
      letterSpacing: "-0.5px"
    }
  }, d.reflection.title), /*#__PURE__*/React.createElement(QuoteBlock, {
    attribution: d.reflection.quoteRef
  }, d.reflection.quote), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 20,
      fontFamily: "var(--dp-font-body)",
      fontWeight: 500,
      fontSize: 19,
      lineHeight: "32px",
      color: "var(--text-primary)"
    }
  }, d.reflection.body[1]), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => onPage("reflection"),
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "chevronRight",
      size: 16
    })
  }, "Continue reading"))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundImage: "url(../../assets/reflections/reflections-21.webp)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: 420
    }
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "88px 32px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--dp-font-display)",
      fontWeight: 600,
      fontSize: 40,
      letterSpacing: "-0.4px"
    }
  }, "Four ways to write it down"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 0",
      fontFamily: "var(--dp-font-body)",
      fontSize: 17,
      lineHeight: "28px",
      color: "var(--text-muted)",
      maxWidth: 560
    }
  }, "The notebook meets you where the day is \u2014 a blank page, a gratitude list, a spot check when something lands hard, or a quiet review before sleep.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onPage("tools"),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--accent)",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 15,
      whiteSpace: "nowrap"
    }
  }, "See the tools \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 20,
      marginTop: 32
    }
  }, d.tools.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      background: "var(--surface-lowest)",
      borderRadius: 16,
      border: "0.5px solid var(--border-card)",
      boxShadow: "var(--shadow-surface)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 96,
      background: t.color,
      display: "grid",
      placeItems: "center",
      color: "#fff",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(RippleField, {
    size: 260,
    style: {
      right: -130,
      top: -130,
      opacity: .8
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 40
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 20px 22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 18
    }
  }, t.label), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: "var(--dp-font-body)",
      fontSize: 15,
      lineHeight: "24px",
      color: "var(--text-muted)"
    }
  }, t.description)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 88,
      background: "var(--accent)",
      color: "#fff",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(RippleField, {
    size: 720,
    style: {
      right: -300,
      top: -300
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "72px 32px",
      display: "grid",
      gridTemplateColumns: "1fr 1.1fr",
      gap: 56,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: ".4px",
      textTransform: "uppercase",
      color: "rgba(255,255,255,.7)"
    }
  }, "Featured speaker"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "12px 0 16px",
      fontFamily: "var(--dp-font-display)",
      fontWeight: 500,
      fontSize: 44,
      lineHeight: "50px",
      color: "#fff"
    }
  }, d.featured.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--dp-font-reading)",
      fontSize: 20,
      lineHeight: "34px",
      color: "rgba(255,255,255,.9)"
    }
  }, "\u201C", d.featured.quote, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 16
    }
  }, d.featured.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "play",
      size: 18
    })
  }, "Listen now"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    style: {
      color: "#fff",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,.45)"
    },
    onClick: () => onPage("speakers")
  }, "Browse all"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, d.speakers.slice(0, 3).map(s => /*#__PURE__*/React.createElement(SpeakerCard, {
    key: s.name,
    name: s.name,
    title: s.title,
    downloaded: s.downloaded
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "88px 32px 0",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 48,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--dp-font-display)",
      fontWeight: 600,
      fontSize: 40,
      letterSpacing: "-0.4px"
    }
  }, "The prayers you already know"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 24px",
      fontFamily: "var(--dp-font-body)",
      fontSize: 17,
      lineHeight: "28px",
      color: "var(--text-muted)"
    }
  }, "Set line by line for reading aloud, with room to keep your own beside them."), /*#__PURE__*/React.createElement(ToolRow, {
    iconName: "leafOnWater",
    title: "Your Prayers",
    description: "A collection of prayers \u2014 and a place to add your own."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-lowest)",
      borderRadius: 20,
      padding: "48px 40px",
      boxShadow: "var(--shadow-ambient)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--dp-font-display)",
      fontStyle: "italic",
      fontSize: 26,
      lineHeight: 1.7,
      color: "#555"
    }
  }, "God, grant me the serenity", /*#__PURE__*/React.createElement("br", null), "to accept the things I cannot change,", /*#__PURE__*/React.createElement("br", null), "courage to change the things I can,", /*#__PURE__*/React.createElement("br", null), "and wisdom to know the difference."))));
}
window.HomePage = HomePage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ReflectionPage.jsx
try { (() => {
function ReflectionPage() {
  const {
    Icon,
    QuoteBlock,
    Button,
    Card
  } = window.DPS;
  const d = window.DPAppData,
    r = d.reflection;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      height: 380,
      display: "flex",
      alignItems: "flex-end",
      backgroundImage: "url(../../assets/reflections/reflections-21.webp)",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--scrim)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: 820,
      margin: "0 auto",
      padding: "0 32px 40px",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: ".4px",
      textTransform: "uppercase",
      color: "rgba(255,255,255,.72)"
    }
  }, d.todayLabel), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "10px 0 0",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 300,
      fontSize: 56,
      lineHeight: "62px",
      letterSpacing: "-1.2px",
      color: "#fff"
    }
  }, r.title))), /*#__PURE__*/React.createElement("article", {
    style: {
      maxWidth: 820,
      margin: "0 auto",
      padding: "48px 32px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 20,
      borderBottom: "1px solid var(--border-soft)",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontSize: 13,
      letterSpacing: ".4px",
      textTransform: "uppercase"
    }
  }, r.step), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 16,
      color: "var(--accent)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bookmark",
    size: 20
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "share",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "28px 0",
      borderBottom: "1px solid var(--border-soft)"
    }
  }, /*#__PURE__*/React.createElement(QuoteBlock, {
    attribution: r.quoteRef,
    style: {
      fontSize: 24
    }
  }, r.quote)), r.body.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      margin: "26px 0",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 500,
      fontSize: 21,
      lineHeight: "38px",
      letterSpacing: "-0.1px"
    }
  }, p)), /*#__PURE__*/React.createElement(Card, {
    tone: "card",
    style: {
      padding: 32,
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: ".4px",
      textTransform: "uppercase",
      color: "var(--accent)"
    }
  }, "Thought for the Day"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: "var(--dp-font-reading)",
      fontSize: 26,
      lineHeight: "40px"
    }
  }, r.thought)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      padding: "28px 32px",
      background: "var(--surface-lowest)",
      border: "0.5px solid var(--border-card)",
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: ".4px",
      textTransform: "uppercase",
      color: "var(--accent)"
    }
  }, "Practice"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: "var(--dp-font-body)",
      fontSize: 18,
      lineHeight: "28px",
      maxWidth: 520
    }
  }, r.practice)), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "feather",
      size: 18
    })
  }, "Write about this")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 48,
      paddingTop: 24,
      borderTop: "1px solid var(--border-soft)",
      color: "var(--accent)",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u2190 February 7"), /*#__PURE__*/React.createElement("span", null, "February 9 \u2192"))));
}
window.ReflectionPage = ReflectionPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ReflectionPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteChrome.jsx
try { (() => {
function SiteHeader({
  page,
  onPage
}) {
  const {
    Button
  } = window.DPS;
  const nav = [["home", "Home"], ["reflection", "Today's Reflection"], ["tools", "Daily Tools"], ["speakers", "Speakers"]];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 5,
      background: "var(--surface-glass)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--rule)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "16px 32px",
      display: "flex",
      alignItems: "center",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onPage("home"),
    style: {
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontFamily: "var(--dp-font-display)",
      fontStyle: "italic",
      fontWeight: 600,
      fontSize: 24,
      color: "var(--accent-strong)"
    }
  }, "Al-Anon Daily Paths"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 26,
      marginLeft: "auto"
    }
  }, nav.map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => onPage(id),
    style: {
      background: "none",
      border: "none",
      padding: "4px 0",
      cursor: "pointer",
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 15,
      letterSpacing: "-0.1px",
      color: page === id ? "var(--accent-strong)" : "var(--text-muted)",
      borderBottom: page === id ? "2px solid var(--accent)" : "2px solid transparent"
    }
  }, label))), /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Get the app")));
}
function SiteFooter() {
  const {
    Icon
  } = window.DPS;
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--accent-strong)",
      color: "rgba(255,255,255,.85)",
      marginTop: 80,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "56px 32px 40px",
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
      gap: 40,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-display)",
      fontStyle: "italic",
      fontWeight: 600,
      fontSize: 26,
      color: "#fff"
    }
  }, "Al-Anon Daily Paths"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 12,
      fontSize: 15,
      lineHeight: "24px",
      maxWidth: 340
    }
  }, "A daily reading, a place to write it down, and voices that have walked it before you.")), [["Daily", "Today's reflection", "Reading archive", "Thought for the day"], ["Tools", "Journal", "Gratitude", "Spot Check", "Nightly Review"], ["More", "Speakers", "Prayers", "Support", "Privacy"]].map(col => /*#__PURE__*/React.createElement("div", {
    key: col[0]
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      letterSpacing: ".6px",
      textTransform: "uppercase",
      color: "rgba(255,255,255,.55)",
      marginBottom: 12
    }
  }, col[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, col.slice(1).map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      fontSize: 15
    }
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid rgba(255,255,255,.15)",
      padding: "18px 32px",
      textAlign: "center",
      fontSize: 12,
      letterSpacing: ".4px",
      color: "rgba(255,255,255,.5)"
    }
  }, "Not affiliated with Al-Anon Family Group Headquarters, Inc. \xB7 Sample site for design purposes"));
}
window.SiteHeader = SiteHeader;
window.SiteFooter = SiteFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SpeakersPage.jsx
try { (() => {
function SpeakersPage() {
  const {
    Icon,
    Field,
    Input,
    SpeakerCard,
    Pill,
    ProgressBar,
    Button,
    RippleField
  } = window.DPS;
  const d = window.DPAppData;
  const [q, setQ] = React.useState("");
  const list = d.speakers.filter(s => (s.name + " " + s.title).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--accent)",
      color: "#fff",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(RippleField, {
    size: 680,
    style: {
      right: -300,
      top: -340
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "64px 32px",
      display: "grid",
      gridTemplateColumns: "1fr 380px",
      gap: 48,
      alignItems: "end"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: ".4px",
      textTransform: "uppercase",
      color: "rgba(255,255,255,.7)"
    }
  }, "Speaker recordings"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "12px 0 0",
      fontFamily: "var(--dp-font-display)",
      fontWeight: 500,
      fontSize: 56,
      lineHeight: "62px",
      color: "#fff"
    }
  }, "Voices that have walked it")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-lowest)",
      borderRadius: 16,
      padding: 14,
      boxShadow: "var(--shadow-ambient)"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 18,
      color: "var(--accent)"
    })
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search speakers\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "36px 32px 0",
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    selected: true
  }, "Newest"), /*#__PURE__*/React.createElement(Pill, null, "A\u2013Z"), /*#__PURE__*/React.createElement(Pill, null, "Downloaded"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: "var(--dp-font-body)",
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, list.length, " recordings")), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "20px 32px 0",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 18
    }
  }, list.map(s => /*#__PURE__*/React.createElement(SpeakerCard, {
    key: s.name,
    name: s.name,
    title: s.title,
    downloaded: s.downloaded
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "40px auto 0",
      padding: "0 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-lowest)",
      border: "0.5px solid var(--border-card)",
      borderRadius: 16,
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: 20,
      boxShadow: "var(--shadow-surface)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 12,
      background: "var(--accent)",
      color: "#fff",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "var(--dp-font-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 17
    }
  }, d.featured.name, " \u2014 ", d.featured.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, "18:24 / 47:10")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: 0.39
  }))), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm"
  }, "Download"))));
}
window.SpeakersPage = SpeakersPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SpeakersPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ToolsPage.jsx
try { (() => {
function ToolsPage() {
  const {
    Icon,
    EntryCard,
    Pill,
    Button,
    RippleField
  } = window.DPS;
  const d = window.DPAppData;
  const [active, setActive] = React.useState("spot_check");
  const tool = d.tools.find(t => t.id === active);
  const prompts = {
    journal: ["What's on your mind…"],
    gratitude: ["I'm grateful for…", "I'm grateful for…", "I'm grateful for…"],
    spot_check: ["What happened?", "What am I feeling?", "What's my part?", "What's the next right thing?"],
    nightly_review: ["What disturbed my serenity today?", "Where was I selfish, dishonest, or afraid?", "Do I owe anyone an amend?", "What did I do well today?", "What am I grateful for tonight?"]
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--accent-strong)",
      color: "#fff",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(RippleField, {
    size: 640,
    style: {
      right: -260,
      top: -320
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "72px 32px 64px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 13,
      letterSpacing: ".4px",
      textTransform: "uppercase",
      color: "rgba(255,255,255,.7)"
    }
  }, "The notebook"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "12px 0 0",
      maxWidth: 700,
      fontFamily: "var(--dp-font-display)",
      fontWeight: 500,
      fontSize: 56,
      lineHeight: "62px",
      color: "#fff"
    }
  }, "Four ways to write it down"))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "48px 32px 0",
      display: "grid",
      gridTemplateColumns: "300px 1fr",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, d.tools.map(t => {
    const on = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setActive(t.id),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        cursor: "pointer",
        textAlign: "left",
        background: on ? "var(--surface-lowest)" : "transparent",
        border: on ? "0.5px solid var(--border-card)" : "0.5px solid transparent",
        borderLeft: "3.5px solid " + (on ? t.color : "transparent"),
        borderRadius: 14,
        boxShadow: on ? "var(--shadow-card)" : "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: t.color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 24
    })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: "var(--dp-font-body)",
        fontWeight: 600,
        fontSize: 17,
        color: "var(--text-primary)"
      }
    }, t.label), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: "var(--dp-font-body)",
        fontSize: 14,
        color: "var(--text-muted)"
      }
    }, t.description)));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-lowest)",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "var(--shadow-ambient)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--hero-gradient)",
      padding: "20px 28px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: tool.icon,
    size: 24,
    strokeWidth: 2
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-display)",
      fontStyle: "italic",
      fontWeight: 600,
      fontSize: 22
    }
  }, tool.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      background: tool.color
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "28px 32px 32px",
      background: "var(--surface)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--dp-font-display)",
      fontStyle: "italic",
      fontSize: 21,
      color: "var(--accent-strong)",
      paddingBottom: 18,
      borderBottom: "1px solid var(--rule)"
    }
  }, active === "spot_check" ? "Pause. Breathe. Work through what's happening." : active === "nightly_review" ? "Take a quiet moment to review your day with honesty and compassion." : active === "gratitude" ? "What are you grateful for today?" : "Write freely — no prompts, no structure."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      marginTop: 22
    }
  }, prompts[active].map((q, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: "var(--surface-lowest)",
      borderRadius: 14,
      padding: "18px 20px",
      boxShadow: "var(--shadow-card)"
    }
  }, active === "spot_check" || active === "nightly_review" ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: tool.color,
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontSize: 11,
      fontWeight: 700
    }
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontWeight: 600,
      fontSize: 16,
      color: "var(--accent-strong)"
    }
  }, q)) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: tool.color
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: tool.icon,
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--dp-font-body)",
      fontStyle: "italic",
      fontSize: 15,
      color: "var(--text-muted)"
    }
  }, q)), (active === "spot_check" || active === "nightly_review") && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      background: "var(--surface)",
      border: "1px solid rgba(45,76,71,.08)",
      borderRadius: 10,
      padding: "12px 14px",
      fontFamily: "var(--dp-font-body)",
      fontStyle: "italic",
      fontSize: 13,
      color: "var(--text-muted)"
    }
  }, "Write here\u2026")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, null, "Save entry"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--page-max)",
      margin: "0 auto",
      padding: "72px 32px 0"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--dp-font-display)",
      fontWeight: 600,
      fontSize: 36
    }
  }, "Your timeline"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 24px",
      fontFamily: "var(--dp-font-body)",
      fontSize: 17,
      color: "var(--text-muted)"
    }
  }, "Everything you write, in one quiet stream \u2014 filterable by type, searchable, and private to your device."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    selected: true
  }, "All"), d.tools.map(t => /*#__PURE__*/React.createElement(Pill, {
    key: t.id,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 16
    })
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2,1fr)",
      gap: 14
    }
  }, d.entries.flatMap(g => g.items).map((e, i) => /*#__PURE__*/React.createElement(EntryCard, {
    key: i,
    type: e.type,
    time: e.time,
    preview: e.preview
  })))));
}
window.ToolsPage = ToolsPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ToolsPage.jsx", error: String((e && e.message) || e) }); }

__ds_ns.EntryCard = __ds_scope.EntryCard;

__ds_ns.HeroCard = __ds_scope.HeroCard;

__ds_ns.PrayerCard = __ds_scope.PrayerCard;

__ds_ns.QuoteBlock = __ds_scope.QuoteBlock;

__ds_ns.RippleField = __ds_scope.RippleField;

__ds_ns.SpeakerCard = __ds_scope.SpeakerCard;

__ds_ns.ToolRow = __ds_scope.ToolRow;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.DP_ICON_PATHS = __ds_scope.DP_ICON_PATHS;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.AppHeader = __ds_scope.AppHeader;

__ds_ns.CollectionLink = __ds_scope.CollectionLink;

__ds_ns.PageTitle = __ds_scope.PageTitle;

__ds_ns.SectionTitle = __ds_scope.SectionTitle;

__ds_ns.TabBar = __ds_scope.TabBar;

})();
