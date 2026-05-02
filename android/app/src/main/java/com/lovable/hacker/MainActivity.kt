package com.lovable.hacker

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : AppCompatActivity() {

    companion object {
        // 🔧 Troque pela URL do seu jogo:
        //   • emulador acessando localhost do PC: "http://10.0.2.2:5173"
        //   • celular físico na mesma rede Wi-Fi: "http://192.168.x.x:5173"
        //   • produção (Lovable publicado): "https://seu-projeto.lovable.app"
        private const val GAME_URL = "https://id-preview--4c262f57-29b3-42ca-a1bf-5421816b9568.lovable.app"
    }

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)

        // Edge-to-edge + barra de status escura combinando com o tema cyberpunk
        WindowCompat.setDecorFitsSystemWindows(window, true)
        window.statusBarColor = Color.parseColor("#08070F")
        window.navigationBarColor = Color.parseColor("#08070F")
        WindowInsetsControllerCompat(window, window.decorView).isAppearanceLightStatusBars = false
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        webView = WebView(this).apply {
            layoutParams = android.view.ViewGroup.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.parseColor("#08070F"))
        }
        setContentView(webView)

        configureWebView()
        webView.loadUrl(GAME_URL)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack() else { isEnabled = false; onBackPressedDispatcher.onBackPressed() }
            }
        })
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        with(webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = false
            loadWithOverviewMode = true
            useWideViewPort = true
            mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            userAgentString = "$userAgentString HackerAndroidApp/1.0"
        }

        WebView.setWebContentsDebuggingEnabled(true)

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                // Mantém navegação interna dentro do WebView
                return false
            }
        }
        webView.webChromeClient = WebChromeClient()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
        hideSystemBars()
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    private fun hideSystemBars() {
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.hide(WindowInsetsCompat.Type.navigationBars())
        controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        )
    }
}
