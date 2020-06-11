// import "./styles.css";
import styles from './styles';

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
  console.log("opts is ", opts)

  n.classList = "oot_base oot_outline_mini";            // initial starting class (start "closed")
  initState(opts)
  els.forEach(e => {                                    // loop through the headings
    if (!e.id) { e.id = e.textContent }                 // set an id if the element doesn't have one.
    n.appendChild(CreateOutlineItem(e));                // send the element to be turned into a list item.
    outlineDS.push(e.textContent);                      // put text contents into datastructure
  });

  document.body.appendChild(n);                         // Graft that it onto your site.
  transformMode(n, "mini");                             // Start in mini mode.
  n.addEventListener("mouseenter", () => openMenu(opts));
  n.addEventListener("mouseleave", () => closeMenu(opts));

  // - styling
  var s = styles.buildCSS(opts)
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
  var node = document.createElement("LI");
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

export default init
