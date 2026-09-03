# Branching-Modell

Nichts geht direkt auf `main`. Jede Änderung läuft über einen eigenen Branch und
wird zuerst auf `dev` gesammelt, bevor sie als Release nach `main` geht.

```
feature/xyz ─┐
fix/abc ─────┼──► dev ──► main
chore/def ───┘   (Integration)  (live / stabil)
```

## Die beiden festen Branches

| Branch | Zweck | Regeln |
| --- | --- | --- |
| `main` | Stabil, das was live geht | PR nötig, **1 Approval**, `build` muss grün sein, linear history |
| `dev` | Integration — hier läuft alles zusammen | PR nötig, **kein** Approval nötig, `build` muss grün sein |

`dev` bewusst ohne Approval-Pflicht: Wir sind zu zweit, und Feature-Arbeit soll
nicht blockieren. Das Vier-Augen-Prinzip greift beim Schritt `dev → main`, wo es
zählt.

## Arbeits-Branches

Immer von **`dev`** abzweigen, nie von `main`:

```bash
git checkout dev
git pull
git checkout -b feature/hero-section-redesign
```

Namensschema — Präfix sagt, worum es geht:

| Präfix | Wofür | Beispiel |
| --- | --- | --- |
| `feature/` | Neues Feature, sichtbare Änderung | `feature/hero-section-redesign` |
| `fix/` | Bugfix | `fix/nav-overlap-mobile` |
| `chore/` | Tooling, Dependencies, Config | `chore/update-vite` |
| `docs/` | Nur Dokumentation | `docs/branching-model` |
| `hotfix/` | Dringend, geht ausnahmsweise direkt auf `main` | `hotfix/broken-contact-form` |

Danach in Kleinbuchstaben mit Bindestrichen, kurz und beschreibend.

> Im Verlauf gab es `fixture/…` — das war ein Vertipper für `fix/`. Bitte nicht
> weiterverwenden.

## Ablauf

1. Branch von `dev` erstellen (siehe oben)
2. Arbeiten, committen, `git push -u origin <branch>`
3. PR **gegen `dev`** öffnen
4. `build` grün abwarten → mergen
5. Branch nach dem Merge löschen

## Release: `dev → main`

Wenn `dev` einen sinnvollen Stand hat:

1. PR von `dev` nach `main` öffnen
2. Der/die andere reviewed und approved (Pflicht auf `main`)
3. Mergen — das ist der Release

## Squash-Merge: eine wichtige Folge

Wir mergen per **Squash**. Der ganze Branch landet dabei als *ein* neuer Commit
im Ziel — die ursprünglichen Commits existieren dort nicht mehr.

Das heisst: **Nach dem Merge ist der Branch tot.** Nicht weiterarbeiten und nicht
erneut einen PR daraus öffnen — Git sieht sonst zwei verschiedene Historien auf
denselben Zeilen und meldet Konflikte, obwohl der Inhalt längst drin ist. (Genau
das ist bei PR #7 passiert.)

Für die nächste Änderung also immer: Branch löschen, `dev` frisch ziehen, neuen
Branch abzweigen.

## Nach einem Merge aufräumen

```bash
git checkout dev
git pull
git branch -d <alter-branch>              # lokal
git push origin --delete <alter-branch>   # remote
```

Alternativ das Häkchen „Delete branch" direkt im gemergten PR auf GitHub.
