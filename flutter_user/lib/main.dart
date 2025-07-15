import 'package:flutter/material.dart';

import 'dart:convert';
import 'package:http/http.dart' as http;

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

class ProgressWebView extends StatefulWidget {
  const ProgressWebView({super.key});

  @override
  State<ProgressWebView> createState() => _ProgressWebViewState();
}

class _ProgressWebViewState extends State<ProgressWebView> {
  final _formKey = GlobalKey<FormState>();
  final _nipController = TextEditingController();
  final _namaController = TextEditingController();
  final _tanggalController = TextEditingController();
  DateTime? _selectedDate;
  final _kinerjaController = TextEditingController();
  final _bobotController = TextEditingController();
  final _statusController = TextEditingController();
  final _keteranganController = TextEditingController();

  List<List<dynamic>> _progressList = [];
  bool _loading = false;

  static const String apiUrl =
      'SCRIPT_WEB_APP_URL'; // Ganti dengan URL Web App Google Script Anda

  @override
  void dispose() {
    _nipController.dispose();
    _namaController.dispose();
    _tanggalController.dispose();
    _kinerjaController.dispose();
    _bobotController.dispose();
    _statusController.dispose();
    _keteranganController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _loading = true);
    final body = jsonEncode({
      'action': 'create',
      'nip': _nipController.text,
      'nama': _namaController.text,
      'tanggal': _tanggalController.text,
      'kinerja': _kinerjaController.text,
      'bobot': _bobotController.text,
      'status': _statusController.text,
      'keterangan': _keteranganController.text,
    });
    try {
      final res = await http.post(
        Uri.parse(apiUrl),
        body: body,
        headers: {'Content-Type': 'application/json'},
      );
      if (res.statusCode == 200 && res.body.contains('Created')) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Data berhasil disimpan!')),
          );
        }
        _clearForm();
        await _fetchProgress();
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Gagal menyimpan data: ${res.body}')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
    setState(() => _loading = false);
  }

  void _clearForm() {
    _nipController.clear();
    _namaController.clear();
    _tanggalController.clear();
    _kinerjaController.clear();
    _bobotController.clear();
    _statusController.clear();
    _keteranganController.clear();
    _selectedDate = null;
  }

  Future<void> _fetchProgress() async {
    setState(() => _loading = true);
    final res = await http.get(Uri.parse(apiUrl));
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      setState(() {
        _progressList = List<List<dynamic>>.from(data);
      });
    }
    setState(() => _loading = false);
  }

  @override
  void initState() {
    super.initState();
    _fetchProgress();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Progress Tracker')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _nipController,
                    decoration: const InputDecoration(labelText: 'NIP'),
                    validator: (v) =>
                        v == null || v.isEmpty ? 'Wajib diisi' : null,
                  ),
                  TextFormField(
                    controller: _namaController,
                    decoration: const InputDecoration(labelText: 'NAMA'),
                    validator: (v) =>
                        v == null || v.isEmpty ? 'Wajib diisi' : null,
                  ),
                  GestureDetector(
                    onTap: _loading
                        ? null
                        : () async {
                            final picked = await showDatePicker(
                              context: context,
                              initialDate: _selectedDate ?? DateTime.now(),
                              firstDate: DateTime(2020),
                              lastDate: DateTime(2100),
                            );
                            if (picked != null) {
                              setState(() {
                                _selectedDate = picked;
                                _tanggalController.text =
                                    '${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}';
                              });
                            }
                          },
                    child: AbsorbPointer(
                      child: TextFormField(
                        controller: _tanggalController,
                        decoration: const InputDecoration(
                          labelText: 'TANGGAL',
                          hintText: 'Pilih tanggal',
                          suffixIcon: Icon(Icons.calendar_today),
                        ),
                        validator: (v) =>
                            v == null || v.isEmpty ? 'Wajib diisi' : null,
                      ),
                    ),
                  ),
                  TextFormField(
                    controller: _kinerjaController,
                    decoration: const InputDecoration(labelText: 'KINERJA'),
                  ),
                  TextFormField(
                    controller: _bobotController,
                    decoration: const InputDecoration(labelText: 'BOBOT'),
                  ),
                  TextFormField(
                    controller: _statusController,
                    decoration: const InputDecoration(labelText: 'STATUS'),
                  ),
                  TextFormField(
                    controller: _keteranganController,
                    decoration: const InputDecoration(labelText: 'KETERANGAN'),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.save),
                      label: _loading
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Simpan Progress'),
                      onPressed: _loading ? null : _submit,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        textStyle: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'Daftar Progress',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            _loading
                ? const Center(child: CircularProgressIndicator())
                : _progressList.length <= 1
                ? const Text('Belum ada data')
                : DataTable(
                    columns: [
                      for (final col in _progressList[0])
                        DataColumn(label: Text(col.toString())),
                    ],
                    rows: [
                      for (final row in _progressList.skip(1))
                        DataRow(
                          cells: [
                            for (final cell in row)
                              DataCell(Text(cell.toString())),
                          ],
                        ),
                    ],
                  ),
          ],
        ),
      ),
    );
  }
}
