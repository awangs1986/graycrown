using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using System.Reflection;
using System.Text.Json;
using System.Globalization;
using System.Runtime.InteropServices;

var rows = JsonSerializer.Deserialize<JsonElement[]>(File.ReadAllText(args[0]))!;
var references = Directory.GetFiles(RuntimeEnvironment.GetRuntimeDirectory(), "*.dll").Select(file => MetadataReference.CreateFromFile(file)).ToArray();
var originalOut = Console.Out;
int passed = 0, cases = 0;
CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;
foreach (var lesson in rows) {
    string id = lesson.GetProperty("id").GetString()!;
    var compilation = CSharpCompilation.Create("Reference_" + id, new[] { CSharpSyntaxTree.ParseText(lesson.GetProperty("solution").GetString()!) }, references,
        new CSharpCompilationOptions(OutputKind.ConsoleApplication, concurrentBuild: false));
    using var bytes = new MemoryStream();
    var emitted = compilation.Emit(bytes);
    if (!emitted.Success) throw new Exception(id + ": " + string.Join("\n", emitted.Diagnostics));
    foreach (var test in lesson.GetProperty("tests").EnumerateArray()) {
        using var output = new StringWriter();
        Console.SetOut(output); Console.SetIn(new StringReader(test.GetProperty("input").GetString()!));
        var entry = Assembly.Load(bytes.ToArray()).EntryPoint!;
        entry.Invoke(null, entry.GetParameters().Length == 0 ? null : new object[] { Array.Empty<string>() });
        Console.SetOut(originalOut);
        var expected = test.GetProperty("output").GetString()!;
        if (output.ToString().Replace("\r\n", "\n") != expected) throw new Exception($"{id}: expected {JsonSerializer.Serialize(expected)}, actual {JsonSerializer.Serialize(output.ToString())}");
        cases++;
    }
    passed++;
    originalOut.WriteLine($"{id} PASS");
}
originalOut.WriteLine($"PASS: {passed} C# reference programs, {cases} input/output cases on real .NET.");
