# Digitale Vermittlung im Museum - Interkit-Projekt zur Masterarbeit

Dieses Repository enthält die Interkit-Installation und die im Rahmen der Masterarbeit entwickelte Vermittlungsanwendung `audioguide_voegel`.

Es dokumentiert die technische Umsetzung des Projekts und macht es möglich die Anwendung sowie des Interkit-Authoring-Systems lokal auszuführen.

Interkit ist ein bestehendes Open Source-System und bildet die technische Grundlage des Projekts:
https://gitlab.interkit.app/interkit/interkit-experiments

Die projektspezifische Anwendung befindet sich unter:

repositories/projects/8HQbW3NPRFFdPR5Ni/

Dort liegt die Umsetzung der Vermittlungsanwendung.

Eine statische Fassung der Vermittlungsanwendung ist unter abrufbar:  
https://tewendel.github.io/fdv-app-static/?archiveMode=true

---

## Lokale Ausführung

### Voraussetzungen

Benötigt werden:

- Git
- Docker Desktop bzw. eine Docker-Installation mit Linux-Containern
- Docker Compose v2
- ein freier Port 80 

---

## Installation und erster Start

Repository klonen:

```sh
git clone https://github.com/tewendel/interkit-masterarbeit.git
cd interkit-masterarbeit
```

Anschließend die Docker-Images bauen:

```sh
docker compose --parallel 1 build
```

(Begrenzung auf einen parallelen Build reduziert den Arbeitsspeicherbedarf, der relativ hoch ist)

Anschließend starten:

```sh
docker compose up -d
```

---

## Zugriff

Nach dem Start ist das Interkit-Interface unter folgender Adresse erreichbar:

http://admin.localhost

Zugangsdaten:

```text
Benutzername: admin
Passwort: reviewer
```

Das Projekt erscheint dort unter:

```text
audioguide_voegel
```

Klick auf Edit oder Preview, um das Projekt aufzurufen.

Um die Vorschau zu laden rechts einmal auf Relaod oder Reset klicken.

Die Anwendung ist lokal anschließend hier erreichbar:

http://app.localhost/app/8HQbW3NPRFFdPR5Ni/

---

## Stoppen und wieder starten

Zum Stoppen:

```sh
docker compose down
```

Zum erneuten Starten:

```sh
docker compose up -d
```

Soll der ursprüngliche Projektzustand vollständig neu geladen werden:

docker compose down --volumes
docker compose up -d

---

## Lizenz und Rechte

Die technische Grundlage dieses Repositories basiert auf Interkit. Die Lizenzbedingungen des ursprünglichen Projekts sind im Interkit-Repository dokumentiert:

https://gitlab.interkit.app/interkit/interkit-experiments