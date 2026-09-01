# Drop 01 photography

## Hero cards ("Three pieces" grid)

  men-dolphin-tee.jpg     -> Men's Dolphin Tee card
  women-ringer-tee.jpg    -> Women's Ringer Tee card
  current-tote.jpg        -> RYVOL Current Tote card

Recommended crop: portrait, roughly 4:5.2 (matches the card aspect ratio),
subject centered-ish so it crops safely on mobile. Until a file exists here,
that card shows the styled "Drop 01" placeholder tile automatically —
nothing breaks, nothing to toggle. This mechanism lives in src/app/page.tsx.

## Campaign section (campaign/ folder)

Each product gets a full editorial section on the homepage (see the
CAMPAIGN array in src/components/HomeClient.tsx): one large hero image,
plus two smaller detail images alongside the product name. Current set:

  campaign/dolphin-tee-01.jpg        -> hero (large)
  campaign/dolphin-tee-02.jpg        -> detail 1
  campaign/dolphin-tee-flatlay.jpg   -> detail 2
  campaign/dolphin-tee-03..13.jpg    -> extra shots, not wired in yet

  campaign/ringer-tee-01.jpg               -> hero (large)
  campaign/ringer-tee-02.jpg               -> detail 1
  campaign/ringer-tee-flatlay-styled.jpg   -> detail 2
  campaign/ringer-tee-03..09.jpg           -> extra shots, not wired in yet
  campaign/ringer-tee-flatlay-back.jpg     -> extra shot, not wired in yet
  campaign/ringer-tee-detail.jpg           -> extra shot, not wired in yet

  campaign/current-tote-01.jpg         -> hero (large)
  campaign/current-tote-detail.jpg     -> detail 1
  campaign/current-tote-02.jpg         -> detail 2
  campaign/current-tote-detail-02.jpg  -> extra shot, not wired in yet

Unlike the hero cards, the campaign section is not availability-checked —
it assumes the files above exist (they do, as of this drop). If you swap in
new photography, keep the same filenames and it just updates, or edit the
CAMPAIGN array directly to point at new files / change which shot is the
hero vs. the details.

Still to place: any video from the shoot (none received yet), and the
remaining "extra shots" listed above (flat lays, additional angles) — there's
currently no gallery/lightbox to put them in. Ask before building one; a
scroll-driven editorial page (more sections, like the campaign one above) or
a simple grid are both reasonable directions.
