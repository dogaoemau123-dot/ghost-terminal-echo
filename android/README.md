# HACKER — Android (WebView wrapper)

Projeto Android nativo que carrega o jogo HACKER (versão web) dentro de um `WebView` em tela cheia.

## Como abrir no Android Studio

1. Abra o Android Studio → **File → Open** → selecione esta pasta `android/`.
2. Aguarde o Gradle sincronizar (baixa SDK / dependências automaticamente).
3. Edite `app/src/main/java/com/lovable/hacker/MainActivity.kt` e troque a constante `GAME_URL` pela URL onde o jogo está hospedado:
   - Em desenvolvimento (PC + emulador): `http://10.0.2.2:5173` (acessa o `localhost` do seu PC).
   - Em desenvolvimento (PC + celular físico na mesma rede Wi-Fi): `http://SEU_IP_LOCAL:5173`.
   - Em produção: a URL publicada do projeto Lovable (ex.: `https://seu-projeto.lovable.app`).
4. Conecte um dispositivo Android (ou inicie um emulador) e clique em **Run ▶**.

> Para usar `http://` (sem TLS) em dev, o `network_security_config.xml` já libera tráfego claro pros IPs comuns. Pra produção, use sempre `https://`.

## Requisitos
- Android Studio Hedgehog ou superior
- Android SDK 34 (compileSdk 34, minSdk 24)
- JDK 17 (vem com o Android Studio)

## Estrutura
```
android/
 ├─ build.gradle.kts            ← config raiz
 ├─ settings.gradle.kts
 ├─ gradle.properties
 └─ app/
     ├─ build.gradle.kts        ← config do app
     ├─ proguard-rules.pro
     └─ src/main/
         ├─ AndroidManifest.xml
         ├─ java/com/lovable/hacker/MainActivity.kt
         └─ res/
             ├─ values/{colors,strings,themes}.xml
             ├─ drawable/splash_background.xml
             ├─ mipmap-anydpi-v26/ic_launcher.xml
             └─ xml/network_security_config.xml
```

## Customizações úteis
- **Ícone**: substitua `mipmap-anydpi-v26/ic_launcher.xml` ou gere um novo via *Image Asset Studio* (botão direito em `res` → New → Image Asset).
- **Nome do app**: edite `res/values/strings.xml`.
- **Modo offline / PWA**: dá pra usar o cache do WebView ou empacotar com Capacitor mais tarde — me avise se quiser migrar.
