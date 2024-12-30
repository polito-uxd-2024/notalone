package com.example.notalone

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController

@Composable
fun HomeScreen(navController: NavHostController) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .background(Color.LightGray)
                    .padding(16.dp)
            ) {
                Text("Ciao sono Al!", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(16.dp))
            Button(onClick = { navController.navigate("chat") }) { // Navigate to "chat"
            Text("Vai a Chat")
            }
            Spacer(modifier = Modifier.height(8.dp))
            Button(onClick = { navController.navigate("call") }) { // Navigate to "call"
                Text("Vai a Call")
            }
        }
    }
}