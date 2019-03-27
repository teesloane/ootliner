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

  var css = "@-webkit-keyframes outline_mini_enter {\n  0% { left: -100px; }\n  100% { left: 0px; }\n}\n\n@keyframes outline_mini_enter {\n  0% { left: -100px; }\n  100% { left: 0px; }\n}\n\n.oot_base {\n  max-height: 70vh;\n  overflow-y: scroll;\n  padding-right: 24px !important;\n}\n\n.oot_outline_expanded {\n  color:         #333;\n  left:          0;\n  padding:       32px 8px 32px 8px !important;\n  margin:        0;\n  position:      fixed;\n  top:           30%;\n  opacity:       1;\n  -webkit-animation: outline_mini_enter 0.4s ease;\n          animation: outline_mini_enter 0.4s ease;\n}\n\n.oot_outline_expanded_hide {\n  color:         #333;\n  left:          -100px !important;\n  padding: 32px 8px 32px 8px !important;\n  position:      fixed;\n  margin: 0;\n  top:           30%;\n  opacity:       0;\n  -webkit-transition:   all 0.4s ease;\n  -o-transition:   all 0.4s ease;\n  transition:   all 0.4s ease;\n}\n\n.oot_outline_mini {\n  -webkit-transition: all 0.2s ease;\n  -o-transition: all 0.2s ease;\n  transition: all 0.2s ease;\n  color:         #333;\n  padding:       32px 8px 32px 0px !important;\n  margin:        0 !important;\n  left:          0;\n  position:      fixed;\n  top:           30%;\n  -webkit-animation-name: outline_mini_enter;\n          animation-name: outline_mini_enter;\n  -webkit-animation-duration: 0.4s;\n          animation-duration: 0.4s;\n}\n\n\n/* Base heading class */\n.oot_base_class {\n  font-family:     \"arial\";\n  list-style-type: none;\n  padding:         4px;\n  margin:          0px;\n  cursor:          pointer;\n  max-width:       500px;\n  padding-top:     6px;\n  padding-bottom:  6px;\n}\n\n.oot_base_class:hover {\n  color: #0070E0;\n}\n\n\n/* Heading specific styles; when in `mini` mode. */\n.oot_h_mini {\n  padding-left: 0 !important;\n}\n\n.oot_h1 {\n  font-size: 0.8rem;\n  font-weight: bold;\n}\n\n.oot_h2 {\n  font-size: 0.8rem;\n  font-weight: 400;\n  padding-left: 1rem;\n\n}\n\n.oot_h3 {\n  font-size: 0.8rem;\n  padding-left: 2rem;\n}\n\n.oot_h4 {\n  font-size: 0.7rem;\n  padding-left: 3rem;\n\n}\n\n.oot_h5 {\n  font-size: 0.7rem;\n  padding-left: 3rem;\n}\n\n.oot_h6 {\n  font-size: 0.7rem;\n  padding-left: 3rem;\n}\n";
  styleInject(css);

  var els;
  var outlineDS = [];
  var outlineOpening = false;
  var outlineClosing = false;
  var n = document.createElement("UL");                    // the main <ul> of the outline.

  /**
   * init builds the outline container for the entire outline.
   * then, it searches for all header tags and runs CreateOutlineItem forEach.
   */
  function init() {
    n.classList = "oot_base oot_outline_mini";            // initial starting class (start "closed")
    initState();
    els.forEach(e => {                                    // loop through the headings
      if (!e.id) { e.id = e.textContent; }                 // set an id if the element doesn't have one.
      n.appendChild(CreateOutlineItem(e));                // send the element to be turned into a list item.
      outlineDS.push(e.textContent);                      // put text contents into datastructure
    });

    document.body.appendChild(n);                         // Graft that shit onto your fully sick site.
    transformMode(n, "mini");                             // Start in mini mode.
    n.addEventListener("mouseenter", openMenu);
    n.addEventListener("mouseleave", closeMenu);
  }

  /**
   * Sets up nodes, etc
   */
  function initState() {
    els = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  }

  /**
   * Sets the classes to close the menu and changes the list item text to dashes.
   */
  function closeMenu() {
    if (outlineClosing) return;
    if (outlineOpening) {
      setTimeout(() => closeMenu(), 400);                 // The menu is currently opening, try again in 400ms.
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
  function openMenu() {
    if (outlineOpening) return

    if (outlineClosing) {
      setTimeout(() => openMenu(), 400);                  // The menu is currently opening, try again in 400ms.
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
