<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## CampusAI architecture
- Keep the explicitly requested single-scrolling landing page at `/` with section anchors; navigation is intentionally in-page.
- Keep sample query matching and answer data in `src/lib/campus-demo.ts`, shared by the hero and playground, so previews stay consistent.
- Treat all campus answers, documents, confidence scores, performance figures, and testimonials as illustrative until real sources are connected; do not imply live AI or working student accounts.
- Use semantic CSS tokens for the CampusAI visual system and existing shadcn controls for interactions.
