import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

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
      home: const ProgressWebView(),
      debugShowCheckedModeBanner: false,
    );
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
