package com.example.notalone

import android.annotation.SuppressLint
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.with
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NotAlone()
        }
    }
}

@OptIn(ExperimentalAnimationApi::class)
@SuppressLint("UnusedContentLambdaTargetStateParameter")
@Composable
fun NotAlone() {
    val navControllerMain = rememberNavController()

    val currentBackStackEntry by navControllerMain.currentBackStackEntryAsState()
    val currentDestination = currentBackStackEntry?.destination?.route

    // Titolo
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // Parte non scrollabile con il titolo
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.Gray)
                .padding(top = 40.dp, bottom = 10.dp),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "notAlone",
                style = MaterialTheme.typography.bodyLarge.copy(),
                fontSize = 40.sp,
                fontWeight = FontWeight.Bold, // Grassetto
                color = Color.White
            )
        }

        // Barra di navigazione in alto
        if (currentDestination != "logScreen") {
            TopNavBar(navController = navControllerMain) // Posizionata subito sotto il titolo
        }

        // Contenuto principale
        Scaffold(
            modifier = Modifier.fillMaxSize(),
            bottomBar = {} // Rimuoviamo la barra di navigazione inferiore
        ) { paddingValues ->
            // NavHost con transizione animata tra schermate
            NavHost(
                navController = navControllerMain,
                startDestination = "home",
                modifier = Modifier.padding(paddingValues)
            ) {
                // Log Screen
                composable("home") {
                    AnimatedContent(
                        targetState = "homeScreen",
                        transitionSpec = {
                            // Transizione animata
                            slideInVertically { height -> -height } + fadeIn() with
                                    slideOutVertically { height -> height } + fadeOut()
                        }, label = ""
                    ) {
                        IntroScreen(navControllerMain = navControllerMain)
                    }
                }

                // Home Screen
                composable("home") {
                    HomeScreen(navControllerMain)
                }
                composable("maps") {
                    MapsScreen()
                }
                composable("sos") {
                    SosScreen()
                }
            }
        }
    }
}

@Composable
fun TopNavBar(navController: NavHostController) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                Color.Gray,
                shape = RoundedCornerShape(bottomStart = 16.dp, bottomEnd = 16.dp)
            )
            .padding(vertical = 8.dp)
    ) {
        Row(
            horizontalArrangement = Arrangement.SpaceEvenly,
            modifier = Modifier.fillMaxWidth()
        ) {
            TopNavBarItem("Maps", onClick = { navController.navigate("maps") })
            TopNavBarItem("Home", onClick = { navController.navigate("home") })
            TopNavBarItem("SOS", onClick = { navController.navigate("sos") })
        }
    }
}

@Composable
fun TopNavBarItem(label: String, onClick: () -> Unit = {}) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clickable { onClick() }
            .padding(horizontal = 16.dp)
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .background(Color.LightGray, shape = RoundedCornerShape(8.dp))
        ) {
            if(label == "Maps"){
                Icon(
                    painter = painterResource(id = R.drawable.maps),
                    contentDescription = label,
                    modifier = Modifier
                        .size(24.dp)
                        .align(Alignment.Center)
                )
            }
            else if(label == "Home"){
                Icon(
                    painter = painterResource(id = R.drawable.primary),
                    contentDescription = label,
                    modifier = Modifier
                        .size(24.dp)
                        .align(Alignment.Center)
                )
            }
            else if(label == "SOS"){
                Icon(
                    painter = painterResource(id = R.drawable.sos),
                    contentDescription = label,
                    modifier = Modifier
                        .size(24.dp)
                        .align(Alignment.Center)
                )
            }
        }
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(top = 4.dp)
        )
    }
}
