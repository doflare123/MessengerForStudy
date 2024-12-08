package com.example.welcomeapp

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Найти элементы интерфейса
        val startButton = findViewById<Button>(R.id.start_button)
        val welcomeText = findViewById<TextView>(R.id.welcome_text)
        val welcomeImage = findViewById<ImageView>(R.id.welcome_image)
        val groupText = findViewById<TextView>(R.id.group_text)

        // Установить видимость текста и изображения невидимой
        welcomeText.visibility = View.GONE
        welcomeImage.visibility = View.GONE

        // Обработчик нажатия кнопки
        startButton.setOnClickListener {
            if (welcomeText.visibility == View.VISIBLE) {
                welcomeText.visibility = View.GONE
                welcomeImage.visibility = View.GONE
                groupText.visibility = View.GONE
            } else {
                welcomeText.visibility = View.VISIBLE
                welcomeImage.visibility = View.VISIBLE
                groupText.visibility = View.VISIBLE
            }
        }

    }
}