import asyncio, os
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openrouter import OpenRouterProvider
from pydantic_ai.toolsets.fastmcp import FastMCPToolset

# Default: OpenRouter + Sonnet
model = OpenAIChatModel(
    os.environ.get("OPENROUTER_MODEL", "anthropic/claude-sonnet-4"),
    provider=OpenRouterProvider(api_key=os.environ["OPENROUTER_API_KEY"]),
)
# or BYOK direct: model = "anthropic:claude-sonnet-4-20250514"

async def main():
    toolset = FastMCPToolset("mcp-server/server.py")
    agent = Agent(
        model,
        system_prompt=open("skill.md").read(),
        toolsets=[toolset],
    )
    async with agent:
        result = await agent.run("Revenue by venue for 2025, and who are the top 5 customers?")
        print(result.output)

asyncio.run(main())
