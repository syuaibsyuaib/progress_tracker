import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const ProgressTrackerApp());
}

class ProgressTrackerApp extends StatelessWidget {
  const ProgressTrackerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Progress Tracker',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const ProgressWebView(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class ProgressWebView extends StatelessWidget {
  const ProgressWebView({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadRequest(
        Uri.parse('https://syuaibsyuaib.github.io/progress_tracker/user.html'),
      ); // Ganti dengan URL user.html GitHub Pages Anda

    return Scaffold(
      appBar: AppBar(title: Text('Progress Tracker')),
      body: WebViewWidget(controller: controller),
    );
  }
}
