"""Pluggable Model Factory for Agentic Core."""
from langchain_core.language_models.chat_models import BaseChatModel
from app.core.config import settings


def get_llm(temperature: float = 0.0) -> BaseChatModel:
    """Returns the configured LLM / VLM instance."""
    if settings.use_local_ollama:
        from langchain_community.chat_models import ChatOllama
        return ChatOllama(
            model="qwen2.5-vl:7b",
            base_url=settings.ollama_base_url,
            temperature=temperature
        )

    if settings.anthropic_api_key:
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(
            model="claude-3-5-sonnet-20241022",
            api_key=settings.anthropic_api_key,
            temperature=temperature
        )

    if settings.openai_api_key:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model="gpt-4o",
            api_key=settings.openai_api_key,
            temperature=temperature
        )

    # Fallback to local mock/deterministic model or OpenAI generic
    from langchain_community.chat_models.fake import FakeListChatModel
    return FakeListChatModel(responses=["Automated analysis response"])
