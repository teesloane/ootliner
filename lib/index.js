var ootliner = (function () {
  'use strict';

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

  var styles = {styleInject, buildCSS};

  // import "./styles.css";

  var els;
  var outlineDS = [];
  var outlineOpening = false;
  var outlineClosing = false;
  var n = document.createElement("UL");                    // the main <ul> of the outline.

  /**
   * init builds the outline container for the entire outline.
   * then, it searches for all header tags and runs CreateOutlineItem forEach.
   */
  function init(opts) {
    console.log("opts is ", opts);

    n.classList = "oot_base oot_outline_mini";            // initial starting class (start "closed")
    initState(opts);
    els.forEach(e => {                                    // loop through the headings
      if (!e.id) { e.id = e.textContent; }                 // set an id if the element doesn't have one.
      n.appendChild(CreateOutlineItem(e));                // send the element to be turned into a list item.
      outlineDS.push(e.textContent);                      // put text contents into datastructure
    });

    document.body.appendChild(n);                         // Graft that it onto your site.
    transformMode(n, "mini");                             // Start in mini mode.
    n.addEventListener("mouseenter", () => openMenu(opts));
    n.addEventListener("mouseleave", () => closeMenu(opts));

    // - styling
    const s = styles.buildCSS(opts);
    styles.styleInject(s);
  }


  /**
   * Sets up nodes, etc
   */
  function initState(opts) {
    els = document.querySelectorAll(opts.headings || "h1, h2, h3, h4, h5, h6");
  }

  /**
   * Sets the classes to close the menu and changes the list item text to dashes.
   */
  function closeMenu(opts) {
    if (outlineClosing) return;
    if (outlineOpening) {
      setTimeout(() => closeMenu(opts), 400);             // The menu is currently opening, try again in 400ms.
    } else {
      outlineClosing = true;                              // The menu is closing now, so let's
      n.classList = "oot_base oot_outline_expanded_hide"; // remove class so we can do:
      void n.offsetWidth;                                 // hack to recalculate css to trigger animation.
      setTimeout(() => {
        n.classList = "oot_base oot_outline_mini";        // initial starting class
        transformMode(n, "mini");
        outlineClosing = false;
      }, 400);
    }
  }

  /**
   * Sets css classes to open the Ootliner.
   * After 400ms, set outlineOpening to false.
   */
  function openMenu(opts) {
    if (outlineOpening) return

    if (outlineClosing) {
      setTimeout(() => openMenu(opts), 400);                  // The menu is currently opening, try again in 400ms.
    } else {
      outlineOpening = true;
      n.classList = "oot_base";                           // remove class so we can do:
      void n.offsetWidth;                                 // hack to recalculate css to trigger animation.
      n.classList = "oot_base oot_outline_expanded";      // initial starting class
      transformMode(n, "full");                           // convert outline items to their text headings.
      setTimeout(() => {
        outlineOpening = false;
      }, 400);                                            // done opening, set it to false
    }
  }

  /**
   * Alters the outline based on mouse position:
   * ie: mouse enters -> loop overall dom elements
   * if mode == mini  -> update <li>'s -> to oot_h_mini -> (shrink 'em, move flush to window left)
   * if mode == full  -> remove the `oot_h_mini` class and re-add the text contents of the <li>
   */
  function transformMode(outline, mode) {
    var items = Array.from(outline.children);
    var fmt = (el, dash) => {
      el.textContent = dash;
    };
    var hasH = (el, h) => el.classList.contains("oot_" + h);

    if (mode === "mini") {
      items.forEach(el => {
        if (hasH(el, "h1") || hasH(el, "h2")) {
          el.classList.add("oot_h_mini");
          fmt(el, "—");
        } else {
          el.classList.add("oot_h_mini");
          fmt(el, "‐");
        }
      });
    }

    if (mode === "full") {
      items.forEach((el, idx) => {
        el.classList.remove("oot_h_mini");
        fmt(el, outlineDS[idx]);
      });
    }
  }

  /**
   * createOutlineItem receives a heading node and makes a LI node for it.
   */
  function CreateOutlineItem(e) {
    let node = document.createElement("LI");
    node.setAttribute("class", "oot_base_class " + applyStyling(e.tagName));
    node.onclick = () => jumpToHeading(e.id);
    node.textContent = e.textContent;
    return node;
  }

  /**
   * jumpToHeading takes the outlineItem clicked and scrolls to it on the page.
   */
  function jumpToHeading(id) {
    var x = document.getElementById(id);
    x.scrollIntoView({ behavior: "smooth" });
  }

  function applyStyling(elType) {
    switch (elType) {
      case "H1":
        return `oot_h1`;
      case "H2":
        return `oot_h2`;
      case "H3":
        return `oot_h3`;
      case "H4":
        return `oot_h4`;
      case "H5":
        return `oot_h5`;
      case "H6":
        return `oot_h6`;
      default:
        return ``;
    }
  }

  return init;

}());
