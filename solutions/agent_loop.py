from dotenv import load_dotenv; load_dotenv()
from openai import OpenAI  # OpenAI SDK -> any OpenAI-compatible endpoint
import duckdb, json, os, sys

# Default: OpenRouter + Claude Sonnet (BYOK)
# client = OpenAI(
#     base_url="https://openrouter.ai/api/v1",
#     api_key=os.environ["OPENROUTER_API_KEY"],
# )
# MODEL = os.environ.get("OPENROUTER_MODEL", "anthropic/claude-sonnet-4")

# Side-note: fully local, swap the two lines above for:
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
# MODEL  = "gemma4:26b"
MODEL = "qwen3.5:0.8b"
con = duckdb.connect("duckoffee.duckdb", read_only=True)

tools = [{"type": "function", "function": {
    "name": "query_duckdb",
    "description": "Execute a read-only SQL query on the Duckoffee database.",
    "parameters": {"type": "object", "properties": {"sql": {"type": "string"}}, "required": ["sql"]},
}}]

def run_tool(name, args):
    if name == "query_duckdb":
        try:
            rows = con.execute(args["sql"]).fetchall()
            cols = [d[0] for d in con.description]
            return json.dumps({"columns": cols, "rows": rows[:50]}, default=str)
        except Exception as e:
            return json.dumps({"error": str(e)})

def ask(question):
    messages = [{"role": "user", "content": question}]
    while True:
        response = client.chat.completions.create(model=MODEL, tools=tools, messages=messages)
        choice = response.choices[0]
        messages.append(choice.message)
        if choice.finish_reason != "tool_calls":
            return choice.message.content
        for call in choice.message.tool_calls:
            args = json.loads(call.function.arguments)
            print(f"  tool: {call.function.name}: {args.get('sql', '')[:70]}")
            result = run_tool(call.function.name, args)
            messages.append({"role": "tool", "tool_call_id": call.id, "content": result})

question = sys.argv[1] if len(sys.argv) > 1 else "What are the top 5 best-selling products?"
print(ask(question))
