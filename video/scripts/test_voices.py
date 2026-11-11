import asyncio
import edge_tts
import os

TEXT_SAMPLE = (
    "Você tem um negócio local, restaurante, barbearia ou consultório, mas ainda não tem seu próprio site? "
    "Saiba que você está perdendo clientes todos os dias. "
    "Mais de 46% das pesquisas no Google têm intenção local. "
    "E 84% dos consumidores confiam muito mais em quem tem site próprio. "
    "Neste mês de novembro, garanta sua Landing Page com 15% de desconto e parcele em até 5 vezes sem juros."
)

OUT_DIR = os.path.join(os.path.dirname(__file__), '../public/audio/test_voices')
os.makedirs(OUT_DIR, exist_ok=True)

async def test_voices():
    voices = [
        ("pt-BR-ThalitaMultilingualNeural", "thalita.mp3", "+0%"),
        ("pt-BR-FranciscaNeural", "francisca.mp3", "+0%"),
        ("pt-BR-AntonioNeural", "antonio_calm.mp3", "-2%")
    ]
    
    for voice_name, filename, rate in voices:
        out_path = os.path.join(OUT_DIR, filename)
        print(f"Gerando voz: {voice_name}...")
        comm = edge_tts.Communicate(text=TEXT_SAMPLE, voice=voice_name, rate=rate)
        await comm.save(out_path)
        print(f"Salvo em: {out_path}")

if __name__ == '__main__':
    asyncio.run(test_voices())
