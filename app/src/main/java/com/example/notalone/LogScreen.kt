package com.example.notalone


import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController



@Composable
fun IntroScreen(navControllerMain: NavController) {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "slider1"
    ) {
        composable("slider1") {
            SliderScreen(
                title = "Benvenuto su NotAlone",
                text = "Tutorial1",
                isLast = false,
                onNextClick = { navController.navigate("slider2") },
                onSkipClick = { navController.navigate("login") },
                activeIndicator = 0
            )
        }
        composable("slider2") {
            SliderScreen(
                title = "Tutte le Funzionalità a Portata di Mano",
                text = "Tutorial2" ,
                isLast = false,
                onNextClick = { navController.navigate("slider3") },
                onSkipClick = { navController.navigate("login") },
                activeIndicator = 1
            )
        }
        composable("slider3") {
            SliderScreen(
                title = "Inizia il tuo viaggio ora!",
                text = "Tutorial3",
                isLast = true,
                onNextClick = { navController.navigate("login") },
                onSkipClick = { navController.navigate("login") },
                activeIndicator = 2
            )
        }
        composable("login") {
            LoginScreen(
                onRegisterClick = { navController.navigate("signup") },
                onLoginClick = { navControllerMain.navigate("home") } // Navigazione alla Home
            )
        }
        composable("signup") {
            SignUpScreen(
                onBackClick = { navController.popBackStack() },
                onSignUpClick = { navController.navigate("login") }
            )
        }
    }
}

@Composable
fun SliderScreen(
    title: String,
    text: String,
    isLast: Boolean,
    onNextClick: () -> Unit,
    onSkipClick: () -> Unit,
    activeIndicator: Int
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF1F8E9)),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .width(300.dp)
                .padding(16.dp)
                .background(Color(0xFFFFE0B2), shape = RoundedCornerShape(16.dp)),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFB71C1C),
                    textAlign = TextAlign.Center
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text,
                    fontSize = 14.sp,
                    color = Color.DarkGray,
                    textAlign = TextAlign.Center
                )
            }
        }

        Column(
            modifier = Modifier.align(Alignment.BottomCenter).padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "SALTA",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFB71C1C),
                    modifier = Modifier.clickable { onSkipClick() }
                )
                Text(
                    text = if (isLast) "INIZIA" else "AVANTI",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFB71C1C),
                    modifier = Modifier.clickable { onNextClick() }
                )
            }
        }
    }
}

@Composable
fun LoginScreen(onRegisterClick: () -> Unit, onLoginClick: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF1F8E9)),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .width(300.dp)
                .padding(16.dp)
                .background(Color(0xFFFFE0B2), shape = RoundedCornerShape(16.dp)),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Spacer(modifier = Modifier.height(16.dp))
                TextField(
                    value = "",
                    onValueChange = {},
                    placeholder = { Text("User Name") },
                    modifier = Modifier.fillMaxWidth()
                        .background(Color(0xFFFFE0B2))
                )
                Spacer(modifier = Modifier.height(16.dp))
                TextField(
                    value = "",
                    onValueChange = {},
                    placeholder = { Text("Password") },
                    modifier = Modifier.fillMaxWidth()
                        .background(Color(0xFFFFE0B2))
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = onLoginClick,
                    colors = ButtonDefaults.buttonColors(Color(0xFFFA9791))
                ) {
                    Text("Login", color = Color.White)
                }
                Spacer(modifier = Modifier.height(16.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.clickable(onClick = onRegisterClick)
                ) {
                    Text("Non hai un account? Iscriviti", fontSize = 14.sp,color = Color(0xFFB71C1C))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("→", fontSize = 20.sp, fontWeight = FontWeight.Bold,color = Color(0xFFB71C1C))
                }
            }
        }
    }
}

@Composable
fun SignUpScreen(onBackClick: () -> Unit, onSignUpClick: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF1F8E9)),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .width(300.dp)
                .padding(16.dp)
                .background(Color(0xFFFFE0B2), shape = RoundedCornerShape(16.dp)),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Spacer(modifier = Modifier.height(16.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.clickable(onClick = onBackClick)
                ) {
                    Text("←", fontSize = 20.sp, fontWeight = FontWeight.Bold,color = Color(0xFFB71C1C))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Torna indietro", fontSize = 14.sp,color = Color(0xFFB71C1C))
                }
                Spacer(modifier = Modifier.height(16.dp))
                TextField(
                    value = "",
                    onValueChange = {},
                    placeholder = { Text("User Name") },
                    modifier = Modifier.fillMaxWidth(),

                    )
                Spacer(modifier = Modifier.height(16.dp))
                TextField(
                    value = "",
                    onValueChange = {},
                    placeholder = { Text("Password") },
                    modifier = Modifier.fillMaxWidth()

                )
                Spacer(modifier = Modifier.height(16.dp))
                TextField(
                    value = "",
                    onValueChange = {},
                    placeholder = { Text("Conferma Password") },
                    modifier = Modifier.fillMaxWidth()

                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = onSignUpClick,
                    colors = ButtonDefaults.buttonColors(Color(0xFFFA9791))
                ) {
                    Text("Sign Up", color = Color.White)
                }
            }
        }
    }
}
