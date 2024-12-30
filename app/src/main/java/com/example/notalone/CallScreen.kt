package com.example.notalone

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController

@Composable
fun CallScreen(navController: NavHostController) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Immagine di profilo
            Image(
                painter = painterResource(id = R.drawable.ic_profile_picture),
                contentDescription = "Profile Picture",
                modifier = Modifier
                    .size(100.dp)
                    .background(Color.Gray, shape = CircleShape)
                    .padding(16.dp),
                contentScale = ContentScale.Crop
            )
            Spacer(modifier = Modifier.height(16.dp))
            // Testo del nome della persona chiamata
            Text("Nome della Persona", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(32.dp))
            // Pulsanti
            Row(
                horizontalArrangement = Arrangement.SpaceEvenly,
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp)
            ) {
                CallButton(iconId = R.drawable.ic_mute, label = "Mute")
                CallButton(iconId = R.drawable.ic_speaker, label = "Speaker")
                CallButton(iconId = R.drawable.ic_video, label = "Video")
            }
            Spacer(modifier = Modifier.height(16.dp))
            Row(
                horizontalArrangement = Arrangement.SpaceEvenly,
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp)
            ) {
                CallButton(iconId = R.drawable.ic_add_call, label = "Add Call")
                CallButton(iconId = R.drawable.ic_hold, label = "Hold")
                CallButton(iconId = R.drawable.ic_end_call, label = "End Call")
            }
        }
    }
}

@Composable
fun CallButton(iconId: Int, label: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable { /* Aggiungi azione del pulsante */ }
    ) {
        Icon(
            painter = painterResource(id = iconId),
            contentDescription = label,
            modifier = Modifier.size(48.dp)
        )
        Text(label, fontSize = 12.sp)
    }
}