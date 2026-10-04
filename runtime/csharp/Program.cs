using System.Globalization;
using System.Reflection;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;

using System.Text;
using System.Text.Json;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

[assembly: SupportedOSPlatform("browser")]

public partial class CourseRunner
{
    static readonly List<MetadataReference> References = new();
    static byte[]? program;
    public static void Main() { }

    [JSExport]
    public static void AddReference(string base64) => References.Add(MetadataReference.CreateFromImage(Convert.FromBase64String(base64)));

    [JSExport]
    public static string Compile(string source)
    {
        program = null;
        if (source.Length > 100_000) return JsonSerializer.Serialize(new { ok = false, stage = "compile", output = "", stderr = "代码最多 100KB。" });
        var tree = CSharpSyntaxTree.ParseText(source, new CSharpParseOptions(LanguageVersion.CSharp12));
        var compilation = CSharpCompilation.Create("Student_" + Guid.NewGuid().ToString("N"), new[] { CSharpSyntaxTree.ParseText("global using Console = CourseConsole;", new CSharpParseOptions(LanguageVersion.CSharp12)), tree }, References,
            new CSharpCompilationOptions(OutputKind.ConsoleApplication, optimizationLevel: OptimizationLevel.Debug, allowUnsafe: false, concurrentBuild: false));
        using var pe = new MemoryStream();
        var result = compilation.Emit(pe);
        var diagnostics = result.Diagnostics.Where(d => d.Severity == DiagnosticSeverity.Error || d.Severity == DiagnosticSeverity.Warning)
            .Select(d => new { line = d.Location.GetLineSpan().StartLinePosition.Line + 1, column = d.Location.GetLineSpan().StartLinePosition.Character + 1,
                severity = d.Severity.ToString().ToLowerInvariant(), message = d.ToString() }).ToArray();
        if (result.Success) program = pe.ToArray();
        return JsonSerializer.Serialize(new { ok = result.Success, stage = "compile", diagnostics, output = "", stderr = string.Join("\n", diagnostics.Select(d => d.message)) });
    }

    [JSExport]
    public static string Run(string input)
    {
        if (program is null) throw new InvalidOperationException("Compile first.");
        using var output = new LimitedWriter();
        using var errors = new LimitedWriter();

        try
        {
            CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;
            CourseConsole.Output = output; CourseConsole.Error = errors; CourseConsole.Input = new StringReader(input);
            var entry = Assembly.Load(program).EntryPoint ?? throw new InvalidOperationException("需要 Main 入口或顶层语句。");
            var value = entry.Invoke(null, entry.GetParameters().Length == 0 ? null : new object[] { Array.Empty<string>() });
            if (value is Task) throw new InvalidOperationException("本入门课程使用同步 Main，不支持异步入口。");
            var code = value is int exitCode ? exitCode : 0;
            return JsonSerializer.Serialize(new { ok = code == 0, stage = "run", code, output = output.ToString(), stderr = errors.ToString() });
        }
        catch (Exception error)
        {
            var cause = error is TargetInvocationException { InnerException: not null } invocation ? invocation.InnerException : error;
            return JsonSerializer.Serialize(new { ok = false, stage = "run", code = -1, output = output.ToString(), stderr = cause!.GetType().Name + ": " + cause.Message });
        }
        finally { CourseConsole.Input.Dispose(); CourseConsole.Output = TextWriter.Null; CourseConsole.Error = TextWriter.Null; }
    }

    sealed class LimitedWriter : TextWriter
    {
        readonly StringBuilder text = new();
        public override Encoding Encoding => Encoding.UTF8;
        public override void Write(char value)
        {
            if (text.Length >= 65_536) throw new InvalidOperationException("输出超过 64KB，请检查循环。");
            text.Append(value);
        }
        public override string ToString() => text.ToString();
    }
}

// Browser consoles have no terminal stdin. This facade supplies standard synchronous
// text-console operations using the lesson's input and captured output.
public static class CourseConsole
{
    internal static TextReader Input = TextReader.Null;
    internal static TextWriter Output = TextWriter.Null;
    public static TextWriter Error { get; internal set; } = TextWriter.Null;
    public static string? ReadLine() => Input.ReadLine();
    public static int Read() => Input.Read();
    public static void Write(string? value) => Output.Write(value);
    public static void Write(object? value) => Output.Write(value);
    public static void Write(string format, params object?[] values) => Output.Write(format, values);
    public static void WriteLine() => Output.WriteLine();
    public static void WriteLine(string? value) => Output.WriteLine(value);
    public static void WriteLine(object? value) => Output.WriteLine(value);
    public static void WriteLine(string format, params object?[] values) => Output.WriteLine(format, values);
}
