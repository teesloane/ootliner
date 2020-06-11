function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}


function buildCSS(opts) {
  return `
@-webkit-keyframes outline_mini_enter {
  0% { ${opts.position}: -100px; }
  100% { ${opts.position}: 0px; }
}

@keyframes outline_mini_enter {
  0% { ${opts.position}: -100px; }
  100% { ${opts.position}: 0px; }
}

.oot_base {
  max-height: 70vh;
  overflow-y: scroll;
  padding-right: 24px !important;
}

.oot_outline_expanded {
  color:         ${opts.color || "#333"};
  ${opts.position}:          0;
  padding:       32px 16px 32px 16px !important;
  margin:        0;
  position:      fixed;
  top:           ${opts.top || "30%"};
  opacity:       1;
  -webkit-animation: outline_mini_enter ${opts.animationSpeed || "0.4s"} ease;
          animation: outline_mini_enter ${opts.animationSpeed || "0.4s"} ease;
}

.oot_outline_expanded_hide {
  color:         ${opts.color || "#333"};
  ${opts.position}:          -100px !important;
  padding: 32px 16px 32px 16px !important;
  position:      fixed;
  margin: 0;
  top:           ${opts.top || "30%"};
  opacity:       0;
  -webkit-transition:   all ${opts.animationSpeed || "0.4s"} ease;
  -o-transition:   all ${opts.animationSpeed || "0.4s"} ease;
  transition:   all ${opts.animationSpeed || "0.4s"} ease;
}

.oot_outline_mini {
  -webkit-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease;
  color:         ${opts.color || "#333"};
  padding:       32px 8px 32px 0px !important;
  margin:        0 !important;
  ${opts.position}:          0;
  position:      fixed;
  top:           ${opts.top || "30%"};
  -webkit-animation-name: outline_mini_enter;
          animation-name: outline_mini_enter;
  -webkit-animation-duration: ${opts.animationSpeed || "0.4s"};
          animation-duration: ${opts.animationSpeed || "0.4s"};
}


/* Base heading class */
.oot_base_class {
  font-family:     "arial";
  list-style-type: none;
  padding:         4px;
  margin:          0px;
  cursor:          pointer;
  max-width:       500px;
  padding-top:     6px;
  padding-bottom:  6px;
}

.oot_base_class:hover {
  color: ${opts.hoverColour || "#0070E0"};
}


/* Heading specific styles; when in mini mode. */
.oot_h_mini {
  padding-left: 0 !important;
}

.oot_h1 {
  font-size: 0.8rem;
  font-weight: bold;
}

.oot_h2 {
  font-size: 0.8rem;
  font-weight: 400;
  padding-left: 1rem;

}

.oot_h3 {
  font-size: 0.8rem;
  padding-left: 2rem;
}

.oot_h4 {
  font-size: 0.7rem;
  padding-left: 3rem;

}

.oot_h5 {
  font-size: 0.7rem;
  padding-left: 3rem;
}

.oot_h6 {
  font-size: 0.7rem;
  padding-left: 3rem;
}

`

}

export default {styleInject, buildCSS}
