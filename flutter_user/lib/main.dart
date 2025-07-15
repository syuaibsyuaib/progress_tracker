import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const ProgressTrackerApp());
}

class ProgressTrackerApp extends StatelessWidget {
  const ProgressTrackerApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Progress Tracker',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const LoginScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class LoginScreen extends StatelessWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final TextEditingController usernameController = TextEditingController();
    final TextEditingController passwordController = TextEditingController();

    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: usernameController,
              decoration: const InputDecoration(labelText: 'Username'),
            ),
            TextField(
              controller: passwordController,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                final username = usernameController.text;
                final password = passwordController.text;

                // Validate login via Google Apps Script
                final response = await validateLogin(username, password);
                if (response) {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ProgressWebView(),
                    ),
                  );
                } else {
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Login Failed'),
                      content: const Text('Invalid username or password.'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('OK'),
                        ),
                      ],
                    ),
                  );
                }
              },
              child: const Text('Login'),
            ),
          ],
        ),
      ),
    );
  }

  Future<bool> validateLogin(String username, String password) async {
    // Replace with actual API call
    final response = await http.post(
      Uri.parse(
        'https://script.google.com/macros/s/AKfycbxlZW3AxOBaTcPlZCNgFZaI4fMS4nDh2ESv7ujRkDLPz9AZxhNwLduQkbV2YP4iQ3pImw/exec',
      ),
      body: {
        'action': 'validateLogin',
        'username': username,
        'password': password,
      },
    );
    return response.statusCode == 200 && response.body == 'true';
  }
}

class ProgressWebView extends StatefulWidget {
  const ProgressWebView({Key? key}) : super(key: key);

  @override
  State<ProgressWebView> createState() => _ProgressWebViewState();
}

class _ProgressWebViewState extends State<ProgressWebView> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadRequest(
        Uri.parse('https://syuaibsyuaib.github.io/progress_tracker/user.html'),
      );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Progress Tracker')),
      body: WebViewWidget(controller: _controller),
    );
  }
}
