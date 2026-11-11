import asyncio
import edge_tts
import os
import subprocess
import json

SCRIPT_TEXT = (
    "Você tem um negócio local, restaurante, barbearia ou consultório, mas ainda não tem seu próprio site? "
    "Saiba que você está perdendo clientes todos os dias. "
    "Mais de quarenta e seis por cento das buscas no Google têm intenção local. "
    "E oitenta e quatro por cento dos consumidores confiam muito mais em quem tem site próprio. "
    "Se você tem delivery, consultório ou comércio, pare de depender só de redes sociais e de pagar taxas absurdas. "
    "Nós criamos landing pages modernas, ultra rápidas e personalizadas para o seu nicho. "
    "E atenção: só neste mês de novembro, qualquer desenvolvimento de landing page ou CRM está com quinze por cento de desconto! "
    "Pague no cartão em até cinco vezes sem juros, ou ganhe mais cinco por cento de desconto extra no PIX. "
    "Toque em Saiba Mais ou fale conosco direto no WhatsApp!"
)

OUT_DIR = os.path.join(os.path.dirname(__file__), '../public/audio')
os.makedirs(OUT_DIR, exist_ok=True)
VOICE_FILE = os.path.join(OUT_DIR, 'narration_thalita.mp3')
BGM_FILE = os.path.join(OUT_DIR, 'bgm_track.mp3')
FINAL_AUDIO = os.path.join(OUT_DIR, 'audio_meta_ads_final.mp3')

async def generate_thalita_voice():
    print("Gerando narração com pt-BR-ThalitaMultilingualNeural...")
    communicate = edge_tts.Communicate(
        text=SCRIPT_TEXT,
        voice="pt-BR-ThalitaMultilingualNeural",
        rate="+0%",
        pitch="+0Hz"
    )
    await communicate.save(VOICE_FILE)
    print(f"Narração salva em: {VOICE_FILE}")

def generate_background_music(duration_sec):
    print("Sintetizando trilha de fundo harmonizada...")
    fade_start = max(1.0, duration_sec - 3.0)
    filter_graph = (
        f"sine=frequency=220:duration={duration_sec}[s1];"
        f"sine=frequency=330:duration={duration_sec}[s2];"
        f"sine=frequency=440:duration={duration_sec}[s3];"
        f"[s1][s2][s3]amix=inputs=3[chords];"
        f"[chords]volume=0.05,lowpass=f=450,afade=t=in:st=0:d=1.5,afade=t=out:st={fade_start:.2f}:d=3[out]"
    )
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", f"anoisesrc=d={duration_sec}:c=pink:r=44100:a=0.005",
        "-filter_complex", filter_graph,
        "-map", "[out]",
        "-c:a", "libmp3lame",
        "-b:a", "192k",
        BGM_FILE
    ]
    subprocess.run(cmd, check=True)
    print(f"BGM criada: {BGM_FILE}")

def mix_audio():
    cmd_info = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", VOICE_FILE]
    res = subprocess.run(cmd_info, stdout=subprocess.PIPE, text=True, check=True)
    voice_dur = float(res.stdout.strip())
    total_dur = voice_dur + 2.0
    print(f"Duração da narração Thalita: {voice_dur:.2f}s | Duração total: {total_dur:.2f}s")

    generate_background_music(total_dur)

    fade_out_start = max(1.0, total_dur - 2.0)
    # Mix: voz da Thalita com volume equilibrado (1.35) + BGM suave
    mix_filter = (
        f"[0:a]volume=1.35[v];"
        f"[1:a]volume=0.22,afade=t=in:st=0:d=1,afade=t=out:st={fade_out_start:.2f}:d=2[b];"
        f"[v][b]amix=inputs=2:duration=longest:dropout_transition=2[out]"
    )
    mix_cmd = [
        "ffmpeg", "-y",
        "-i", VOICE_FILE,
        "-i", BGM_FILE,
        "-filter_complex", mix_filter,
        "-map", "[out]",
        "-c:a", "libmp3lame",
        "-b:a", "192k",
        FINAL_AUDIO
    ]
    subprocess.run(mix_cmd, check=True)
    print(f"Áudio final mixado: {FINAL_AUDIO}")
    return total_dur, voice_dur

async def main():
    await generate_thalita_voice()
    total_dur, voice_dur = mix_audio()
    timing_file = os.path.join(OUT_DIR, 'timing.json')
    fps = 30
    total_frames = int(round(total_dur * fps))
    metadata = {
        'voice': 'pt-BR-ThalitaMultilingualNeural',
        'total_duration': total_dur,
        'voice_duration': voice_dur,
        'fps': fps,
        'total_frames': total_frames
    }
    with open(timing_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadados de timing salvos em {timing_file}: {total_frames} frames ({total_dur:.2f}s)")

if __name__ == '__main__':
    asyncio.run(main())
