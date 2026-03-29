/**
 * Lincoln Decision Explorer — Content Data
 *
 * This file contains all the content for the Lincoln Decision Explorer app.
 * Edit the entries below to add your own research. The app reads from
 * LINCOLN_DATA at load time.
 *
 * STRUCTURE:
 *   LINCOLN_DATA.timeline  — ordered array of events and decision points
 *   LINCOLN_DATA.documents — flat array of primary source documents
 *
 * TIMELINE ENTRY TYPES:
 *   "event"    — something that happened (date, title, description, category)
 *   "decision" — a choice Lincoln faced (context, pressures, options with chosen/unchosen)
 *
 * Each timeline entry and decision option can reference documents via documentIds[].
 * Documents referenced inline on the timeline will appear as expandable attachment cards.
 */

var LINCOLN_DATA = {

  /* ------------------------------------------------------------------ */
  /*  TIMELINE                                                          */
  /*  Ordered array. Each entry is either an "event" or a "decision".   */
  /* ------------------------------------------------------------------ */
  timeline: [

    // ---- Example Event ----
    {
      id: "evt-001",
      type: "event",
      date: "1861-04-12",
      displayDate: "April 12, 1861",
      title: "Fort Sumter Attacked",
      category: "military",   // "political" | "military" | "diplomatic" | "legal"
      description: "At 4:30 a.m., Confederate batteries opened fire on Fort Sumter in Charleston Harbor, South Carolina. Major Robert Anderson and his garrison of roughly 85 soldiers held out for 34 hours before surrendering on April 13. No Union soldiers were killed during the bombardment, but the attack marked the unmistakable start of armed hostilities.",
      annotation: "The fall of Sumter transformed Northern public opinion overnight. Democrats and Republicans alike rallied behind the flag, giving Lincoln a window of bipartisan support he would not enjoy again.",
      documentIds: []  // IDs of related documents (shown as inline attachments)
    },

    // ---- Example Decision Point ----
    {
      id: "dec-001",
      type: "decision",
      date: "1861-04-14",
      displayDate: "April 14, 1861",
      title: "How to Respond to Fort Sumter",
      context: "With Fort Sumter fallen and Northern opinion inflamed, Lincoln had to decide on the federal government's response. The choice would shape how the conflict was legally framed, which states would join the Confederacy, and whether European powers would intervene.",
      pressures: [
        {
          source: "Northern public opinion",
          position: "Demanded swift, forceful action to punish the rebellion and defend the Union."
        },
        {
          source: "Border states (Kentucky, Missouri, Maryland, Virginia)",
          position: "Warned that aggressive federal military action could push them into the Confederacy."
        },
        {
          source: "Secretary of State Seward",
          position: "Counseled caution; had been privately assuring Southern unionists that Sumter would be evacuated."
        },
        {
          source: "Legal constraints",
          position: "Congress was not in session. Lincoln's immediate authority rested on the 1795 Militia Act, which allowed calling state militia to suppress insurrection — but only for 90 days."
        }
      ],
      options: [
        {
          id: "dec-001-a",
          label: "Call up state militia under the 1795 Militia Act",
          description: "Invoke existing statutory authority to call 75,000 state militia troops for 90 days of federal service to suppress the insurrection and recapture federal property.",
          chosen: true,
          outcome: "Lincoln issued the proclamation on April 15, calling on loyal states to furnish 75,000 militia. The response in the North was overwhelming — states over-subscribed their quotas within days.",
          consequences: "The proclamation framed the conflict as an insurrection (not a war between nations), preserving the legal fiction that the Union was unbroken. However, it triggered secession in Virginia (April 17), Arkansas (May 6), Tennessee (May 7), and North Carolina (May 20).",
          documentIds: ["doc-001"]
        },
        {
          id: "dec-001-b",
          label: "Seek diplomatic resolution",
          description: "Attempt to negotiate with Confederate commissioners or pursue mediation through border-state intermediaries, buying time while avoiding military escalation.",
          chosen: false,
          outcome: "This path was not taken. Historians debate whether any diplomatic opening remained after the firing on Sumter. Confederate President Jefferson Davis had already ordered the attack; the momentum toward separation appeared irreversible in the Deep South.",
          consequences: null,
          documentIds: []
        },
        {
          id: "dec-001-c",
          label: "Convene Congress and request a declaration of war",
          description: "Call Congress into emergency session immediately and ask for a formal declaration of war against the seceding states.",
          chosen: false,
          outcome: "Lincoln chose not to pursue this. A declaration of war would have recognized the Confederacy as a sovereign belligerent — exactly the international standing the South sought. It also would have taken weeks for Congress to assemble.",
          consequences: null,
          documentIds: []
        }
      ],
      documentIds: []  // documents related to the decision overall
    },

    // ---- Example Event (post-decision) ----
    {
      id: "evt-002",
      type: "event",
      date: "1861-04-15",
      displayDate: "April 15, 1861",
      title: "Proclamation Issued — 75,000 Troops Called",
      category: "legal",
      description: "Lincoln issued a proclamation calling forth 75,000 state militia to suppress the insurrection and commanding the rebels to disperse within 20 days. He also summoned Congress to convene in special session on July 4.",
      annotation: "The proclamation's language was carefully chosen. By calling the conflict an 'insurrection' rather than a war, Lincoln kept the legal framework within domestic law and avoided implying Confederate sovereignty.",
      documentIds: ["doc-001"]
    },

    // ---- Example Event (consequence) ----
    {
      id: "evt-003",
      type: "event",
      date: "1861-04-17",
      displayDate: "April 17, 1861",
      title: "Virginia Secedes",
      category: "political",
      description: "The Virginia convention, which had previously voted against secession, reversed course and passed an ordinance of secession in response to Lincoln's call for troops. Virginia's departure was a devastating blow — it was the most populous and industrialized Southern state, and its secession brought Robert E. Lee and other key military figures to the Confederate side.",
      annotation: "Virginia's secession was the most consequential unintended outcome of the troop call. Lincoln had anticipated resistance from the border states but calculated that the Northern rallying effect was worth the risk.",
      documentIds: ["doc-002"]
    }
  ],


  /* ------------------------------------------------------------------ */
  /*  DOCUMENTS                                                         */
  /*  Flat array of primary sources. Referenced by ID from timeline.    */
  /* ------------------------------------------------------------------ */
  documents: [

    {
      id: "doc-001",
      title: "Proclamation Calling Militia and Convening Congress",
      date: "1861-04-15",
      displayDate: "April 15, 1861",
      author: "Abraham Lincoln",
      recipient: null,
      type: "proclamation",   // "letter" | "telegram" | "order" | "proclamation" | "memo" | "speech"
      source: "Abraham Lincoln Papers, Library of Congress",
      fullText: "By the President of the United States\n\nA PROCLAMATION\n\nWhereas the laws of the United States have been, for some time past, and now are opposed, and the execution thereof obstructed, in the States of South Carolina, Georgia, Alabama, Florida, Mississippi, Louisiana and Texas, by combinations too powerful to be suppressed by the ordinary course of judicial proceedings, or by the powers vested in the Marshals by law.\n\nNow therefore, I, Abraham Lincoln, President of the United States, in virtue of the power in me vested by the Constitution, and the laws, have thought fit to call forth, and hereby do call forth, the militia of the several States of the Union, to the aggregate number of seventy-five thousand, in order to suppress said combinations, and to cause the laws to be duly executed.\n\n[Your full text here — this is an abbreviated placeholder.]",
      annotations: [
        {
          startIndex: 100,
          endIndex: 200,
          note: "This clause directly invokes the language of the 1795 Militia Act, establishing the legal basis for the call."
        }
      ],
      tags: ["militia", "proclamation", "75000", "april-1861", "insurrection"]
    },

    {
      id: "doc-002",
      title: "Virginia Ordinance of Secession",
      date: "1861-04-17",
      displayDate: "April 17, 1861",
      author: "Virginia Convention",
      recipient: null,
      type: "order",
      source: "Library of Virginia",
      fullText: "AN ORDINANCE to repeal the ratification of the Constitution of the United States of America, by the State of Virginia, and to resume all the rights and powers granted under said Constitution.\n\n[Your full text here — this is an abbreviated placeholder.]",
      annotations: [],
      tags: ["virginia", "secession", "ordinance", "april-1861"]
    },

    {
      id: "doc-003",
      title: "Letter from Secretary Seward to Minister Adams",
      date: "1861-04-10",
      displayDate: "April 10, 1861",
      author: "William H. Seward",
      recipient: "Charles Francis Adams",
      type: "letter",
      source: "Papers Relating to Foreign Affairs, 1861",
      fullText: "[Your full text here — this is a placeholder for Seward's diplomatic correspondence regarding the evolving crisis.]",
      annotations: [],
      tags: ["seward", "diplomacy", "adams", "april-1861"]
    }
  ]

};
