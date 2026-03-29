/**
 * Lincoln Decision Explorer — Application Logic
 *
 * A vanilla JS single-page app with two views:
 *   1. Timeline-Decision View (main) — merged timeline + decision tree
 *   2. Document Explorer — searchable/filterable primary source browser
 */
(function () {
  "use strict";

  /* ================================================================
     STATE
     ================================================================ */
  var state = {
    activeView: "timeline",
    expandedOptions: {},       // optionId -> true/false
    expandedInlineDocs: {},    // docId-within-entryId -> true/false
    docFilter: { search: "", type: "all", sort: "date-asc" },
    selectedDocumentId: null
  };

  /* ================================================================
     DOM REFERENCES
     ================================================================ */
  var dom = {};

  function cacheDom() {
    dom.viewBtns = document.querySelectorAll(".view-btn");
    dom.timelineView = document.getElementById("TimelineView");
    dom.documentView = document.getElementById("DocumentView");
    dom.docSearch = document.getElementById("DocumentSearch");
    dom.docTypeFilter = document.getElementById("DocumentTypeFilter");
    dom.docSortOrder = document.getElementById("DocumentSortOrder");
    dom.docList = document.getElementById("DocumentList");
    dom.docDetail = document.getElementById("DocumentDetail");
    dom.docDetailTitle = document.getElementById("DocDetailTitle");
    dom.docDetailMeta = document.getElementById("DocDetailMeta");
    dom.docDetailText = document.getElementById("DocDetailText");
    dom.docDetailSource = document.getElementById("DocDetailSource");
    dom.docDetailTimelineLink = document.getElementById("DocDetailTimelineLink");
    dom.docDetailBackBtn = document.getElementById("DocDetailBackBtn");
  }

  /* ================================================================
     INITIALIZATION
     ================================================================ */
  function init() {
    cacheDom();
    bindViewToggle();
    bindDocumentFilters();
    renderTimeline();
  }

  /* ================================================================
     VIEW SWITCHING
     ================================================================ */
  function bindViewToggle() {
    for (var i = 0; i < dom.viewBtns.length; i++) {
      dom.viewBtns[i].addEventListener("click", function () {
        switchView(this.getAttribute("data-view"));
      });
    }
  }

  function switchView(viewName) {
    state.activeView = viewName;

    for (var i = 0; i < dom.viewBtns.length; i++) {
      var btn = dom.viewBtns[i];
      if (btn.getAttribute("data-view") === viewName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }

    if (viewName === "timeline") {
      dom.timelineView.style.display = "block";
      dom.documentView.style.display = "none";
    } else {
      dom.timelineView.style.display = "none";
      dom.documentView.style.display = "block";
      renderDocumentList();
    }
  }

  /* ================================================================
     TIMELINE RENDERING
     ================================================================ */
  function renderTimeline() {
    var container = dom.timelineView;
    container.innerHTML = "";

    var entries = LINCOLN_DATA.timeline;
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (entry.type === "event") {
        container.appendChild(renderEvent(entry));
      } else if (entry.type === "decision") {
        container.appendChild(renderDecision(entry));
      }
    }
  }

  /* ---- Event Card ---- */
  function renderEvent(entry) {
    var wrapper = el("div", "timeline-entry event");
    wrapper.id = "entry-" + entry.id;

    var date = el("div", "timeline-date", entry.displayDate);
    wrapper.appendChild(date);

    var card = el("div", "event-card");

    // Title + category tag
    var h3 = el("h3");
    h3.textContent = entry.title;
    if (entry.category) {
      var tag = el("span", "category-tag " + entry.category, entry.category);
      h3.appendChild(tag);
    }
    card.appendChild(h3);

    // Description
    var desc = el("p", "event-description", entry.description);
    card.appendChild(desc);

    // Annotation
    if (entry.annotation) {
      var ann = el("div", "event-annotation", entry.annotation);
      card.appendChild(ann);
    }

    // Inline documents
    if (entry.documentIds && entry.documentIds.length > 0) {
      card.appendChild(renderInlineDocs(entry.documentIds, entry.id));
    }

    wrapper.appendChild(card);
    return wrapper;
  }

  /* ---- Decision Card ---- */
  function renderDecision(entry) {
    var wrapper = el("div", "timeline-entry decision");
    wrapper.id = "entry-" + entry.id;

    var date = el("div", "timeline-date", entry.displayDate);
    wrapper.appendChild(date);

    var card = el("div", "decision-card");

    // Title
    var h3 = el("h3");
    h3.textContent = entry.title;
    var tag = el("span", "category-tag political", "decision");
    h3.appendChild(tag);
    card.appendChild(h3);

    // Context
    if (entry.context) {
      var ctx = el("p", "decision-context", entry.context);
      card.appendChild(ctx);
    }

    // Pressures
    if (entry.pressures && entry.pressures.length > 0) {
      var pressSection = el("div", "pressures-section");
      pressSection.appendChild(el("h4", null, "Pressures & Considerations"));
      for (var p = 0; p < entry.pressures.length; p++) {
        var pItem = el("div", "pressure-item");
        pItem.appendChild(el("span", "pressure-source", entry.pressures[p].source + ":"));
        pItem.appendChild(el("span", "pressure-position", " " + entry.pressures[p].position));
        pressSection.appendChild(pItem);
      }
      card.appendChild(pressSection);
    }

    // Options
    if (entry.options && entry.options.length > 0) {
      var optSection = el("div", "options-section");
      optSection.appendChild(el("h4", null, "Options"));
      for (var o = 0; o < entry.options.length; o++) {
        optSection.appendChild(renderOption(entry.options[o], entry.id));
      }
      card.appendChild(optSection);
    }

    // Decision-level inline documents
    if (entry.documentIds && entry.documentIds.length > 0) {
      card.appendChild(renderInlineDocs(entry.documentIds, entry.id));
    }

    wrapper.appendChild(card);
    return wrapper;
  }

  /* ---- Decision Option ---- */
  function renderOption(option, decisionId) {
    var isExpanded = !!state.expandedOptions[option.id];
    var chosenClass = option.chosen ? "chosen" : "unchosen";

    var optDiv = el("div", "decision-option " + chosenClass + (isExpanded ? " expanded" : ""));

    // Header
    var header = el("div", "option-header");
    var labelSpan = el("span", "option-label", option.label);
    header.appendChild(labelSpan);

    if (option.chosen) {
      header.appendChild(el("span", "chosen-badge", "Lincoln's choice"));
    }

    header.appendChild(el("span", "option-toggle", isExpanded ? "\u25B2" : "\u25BC"));
    optDiv.appendChild(header);

    // Description (always visible)
    if (option.description) {
      optDiv.appendChild(el("p", "option-description", option.description));
    }

    // Expandable content
    var expanded = el("div", "option-expanded" + (isExpanded ? " open" : ""));

    if (option.outcome) {
      var outcomeDiv = el("div", "option-outcome");
      outcomeDiv.appendChild(el("h5", null, "Outcome"));
      outcomeDiv.appendChild(el("p", null, option.outcome));
      expanded.appendChild(outcomeDiv);
    }

    if (option.consequences) {
      var consDiv = el("div", "option-consequences");
      consDiv.appendChild(el("h5", null, "Consequences"));
      consDiv.appendChild(el("p", null, option.consequences));
      expanded.appendChild(consDiv);
    }

    // Option-level inline documents
    if (option.documentIds && option.documentIds.length > 0) {
      expanded.appendChild(renderInlineDocs(option.documentIds, decisionId + "-" + option.id));
    }

    optDiv.appendChild(expanded);

    // Click to toggle
    optDiv.addEventListener("click", function (e) {
      // Don't toggle if clicking an inline doc or link
      if (e.target.closest(".inline-doc-card") || e.target.closest(".inline-doc-expanded") || e.target.closest(".inline-doc-view-link")) {
        return;
      }
      state.expandedOptions[option.id] = !state.expandedOptions[option.id];
      renderTimeline();
    });

    return optDiv;
  }

  /* ================================================================
     INLINE DOCUMENT ATTACHMENTS
     ================================================================ */
  function renderInlineDocs(docIds, contextKey) {
    var wrapper = el("div", "inline-docs");

    for (var d = 0; d < docIds.length; d++) {
      var doc = findDocument(docIds[d]);
      if (!doc) continue;

      var expandKey = contextKey + "-" + doc.id;
      var isExpanded = !!state.expandedInlineDocs[expandKey];

      // Clickable card
      var card = el("div", "inline-doc-card");
      card.appendChild(el("span", "inline-doc-icon", "\uD83D\uDCC4")); // 📄
      card.appendChild(el("span", "inline-doc-title", doc.title));
      card.appendChild(el("span", "inline-doc-date", " \u2014 " + doc.displayDate));
      (function (key, docObj) {
        card.addEventListener("click", function (e) {
          e.stopPropagation();
          state.expandedInlineDocs[key] = !state.expandedInlineDocs[key];
          renderTimeline();
        });
      })(expandKey, doc);
      wrapper.appendChild(card);

      // Expanded content
      if (isExpanded) {
        var detail = el("div", "inline-doc-expanded open");

        // Meta
        var meta = el("div", "inline-doc-meta");
        meta.appendChild(el("span", null, "Author: " + doc.author));
        if (doc.recipient) {
          meta.appendChild(el("span", null, "To: " + doc.recipient));
        }
        meta.appendChild(el("span", null, "Type: " + doc.type));
        detail.appendChild(meta);

        // Full text with annotations
        var textDiv = el("div", "inline-doc-text");
        textDiv.innerHTML = renderAnnotatedText(doc.fullText, doc.annotations || []);
        detail.appendChild(textDiv);

        // Source
        if (doc.source) {
          detail.appendChild(el("div", "inline-doc-source", "Source: " + doc.source));
        }

        // Link to document explorer
        var viewLink = el("span", "inline-doc-view-link", "View in Document Explorer \u2192");
        (function (docId) {
          viewLink.addEventListener("click", function (e) {
            e.stopPropagation();
            navigateToDocument(docId);
          });
        })(doc.id);
        detail.appendChild(viewLink);

        wrapper.appendChild(detail);
      }
    }

    return wrapper;
  }

  /* ================================================================
     ANNOTATED TEXT RENDERING
     ================================================================ */
  function renderAnnotatedText(text, annotations) {
    if (!annotations || annotations.length === 0) {
      return escapeHtml(text);
    }

    // Sort by startIndex
    var sorted = annotations.slice().sort(function (a, b) {
      return a.startIndex - b.startIndex;
    });

    var result = "";
    var cursor = 0;

    for (var i = 0; i < sorted.length; i++) {
      var ann = sorted[i];
      var start = Math.max(ann.startIndex, cursor);
      var end = Math.min(ann.endIndex, text.length);

      if (start > cursor) {
        result += escapeHtml(text.substring(cursor, start));
      }

      if (start < end) {
        result += '<span class="annotated" data-note="' + escapeAttr(ann.note) + '">';
        result += escapeHtml(text.substring(start, end));
        result += "</span>";
      }

      cursor = end;
    }

    if (cursor < text.length) {
      result += escapeHtml(text.substring(cursor));
    }

    return result;
  }

  /* ================================================================
     DOCUMENT EXPLORER
     ================================================================ */
  function bindDocumentFilters() {
    dom.docSearch.addEventListener("input", function () {
      state.docFilter.search = this.value;
      state.selectedDocumentId = null;
      renderDocumentList();
    });
    dom.docTypeFilter.addEventListener("change", function () {
      state.docFilter.type = this.value;
      state.selectedDocumentId = null;
      renderDocumentList();
    });
    dom.docSortOrder.addEventListener("change", function () {
      state.docFilter.sort = this.value;
      renderDocumentList();
    });
    dom.docDetailBackBtn.addEventListener("click", function () {
      state.selectedDocumentId = null;
      dom.docDetail.classList.remove("visible");
    });
  }

  function renderDocumentList() {
    var docs = filterAndSortDocuments();
    dom.docList.innerHTML = "";
    dom.docDetail.classList.remove("visible");

    if (docs.length === 0) {
      dom.docList.appendChild(el("div", "doc-list-empty", "No documents match your search."));
      return;
    }

    for (var i = 0; i < docs.length; i++) {
      var doc = docs[i];
      var card = el("div", "doc-list-card");

      var titleSpan = el("span", "doc-list-title", doc.title);
      card.appendChild(titleSpan);

      var metaSpan = el("span", "doc-list-meta");
      metaSpan.textContent = doc.displayDate + " \u2014 " + doc.author;
      var typeTag = el("span", "doc-list-type", doc.type);
      metaSpan.appendChild(typeTag);
      card.appendChild(metaSpan);

      (function (docObj) {
        card.addEventListener("click", function () {
          showDocumentDetail(docObj);
        });
      })(doc);

      dom.docList.appendChild(card);
    }
  }

  function filterAndSortDocuments() {
    var docs = LINCOLN_DATA.documents.slice();
    var search = state.docFilter.search.toLowerCase();
    var typeFilter = state.docFilter.type;

    // Filter
    docs = docs.filter(function (doc) {
      if (typeFilter !== "all" && doc.type !== typeFilter) return false;
      if (search) {
        var haystack = (doc.title + " " + doc.author + " " + (doc.recipient || "") + " " + doc.fullText + " " + (doc.tags || []).join(" ")).toLowerCase();
        if (haystack.indexOf(search) === -1) return false;
      }
      return true;
    });

    // Sort
    var sort = state.docFilter.sort;
    docs.sort(function (a, b) {
      if (sort === "date-asc") return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      if (sort === "date-desc") return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      return 0;
    });

    return docs;
  }

  function showDocumentDetail(doc) {
    state.selectedDocumentId = doc.id;

    dom.docDetailTitle.textContent = doc.title;

    // Meta
    var metaHtml = "<span><strong>Date:</strong> " + escapeHtml(doc.displayDate) + "</span>";
    metaHtml += "<span><strong>Author:</strong> " + escapeHtml(doc.author) + "</span>";
    if (doc.recipient) {
      metaHtml += "<span><strong>To:</strong> " + escapeHtml(doc.recipient) + "</span>";
    }
    metaHtml += "<span><strong>Type:</strong> " + escapeHtml(doc.type) + "</span>";
    dom.docDetailMeta.innerHTML = metaHtml;

    // Full text with annotations
    dom.docDetailText.innerHTML = renderAnnotatedText(doc.fullText, doc.annotations || []);

    // Source
    dom.docDetailSource.textContent = doc.source ? "Source: " + doc.source : "";

    // Timeline link
    var timelineEntryId = findTimelineEntryForDoc(doc.id);
    if (timelineEntryId) {
      dom.docDetailTimelineLink.style.display = "";
      dom.docDetailTimelineLink.onclick = function () {
        navigateToTimeline(timelineEntryId);
      };
    } else {
      dom.docDetailTimelineLink.style.display = "none";
    }

    dom.docDetail.classList.add("visible");
  }

  /* ================================================================
     CROSS-LINKING / NAVIGATION
     ================================================================ */
  function navigateToDocument(docId) {
    switchView("documents");
    var doc = findDocument(docId);
    if (doc) {
      showDocumentDetail(doc);
    }
  }

  function navigateToTimeline(entryId) {
    switchView("timeline");
    var target = document.getElementById("entry-" + entryId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.style.outline = "3px solid #00aced";
      setTimeout(function () {
        target.style.outline = "";
      }, 2000);
    }
  }

  /* ================================================================
     HELPERS
     ================================================================ */
  function findDocument(docId) {
    var docs = LINCOLN_DATA.documents;
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].id === docId) return docs[i];
    }
    return null;
  }

  function findTimelineEntryForDoc(docId) {
    var entries = LINCOLN_DATA.timeline;
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (entry.documentIds && entry.documentIds.indexOf(docId) !== -1) {
        return entry.id;
      }
      if (entry.options) {
        for (var o = 0; o < entry.options.length; o++) {
          if (entry.options[o].documentIds && entry.options[o].documentIds.indexOf(docId) !== -1) {
            return entry.id;
          }
        }
      }
    }
    return null;
  }

  function el(tag, className, textContent) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent) node.textContent = textContent;
    return node;
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ================================================================
     BOOT
     ================================================================ */
  document.addEventListener("DOMContentLoaded", init);

})();
