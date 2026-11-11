import asyncio
import edge_tts
import os
import subprocess
import json

OUT_DIR = os.path.join(os.path.dirname(__file__), '../public/audio')
os.makedirs(OUT_DIR, exist_ok=True)

# 1. Roteiro 15 segundos (ágil, direto e comercial)
SCRIPT_15S = (
    "Você ainda não tem um site para o seu negócio? "
    "Pare de perder clientes no Google todos os dias. "
    "Só em novembro, garanta sua Landing Page com quinze por cento de desconto e parcelamento em até cinco vezes. "
    "Toque no botão e fale conosco no WhatsApp!"
)

# 2. Roteiro 30 segundos (completo, dados e demonstração)
SCRIPT_30S = (
    "Você sabia que mais de quarenta e seis por cento das buscas no Google procuram negócios locais como o seu? "
    "Se você tem delivery, barbearia ou consultório e ainda não tem site, seus clientes estão indo para a concorrência. "
    "Nós criamos Landing Pages modernas, ultra rápidas e com botão de WhatsApp integrado. "
    "Só em novembro, aproveite quinze por cento de desconto no cartão ou PIX. "
    "Fale conosco agora mesmo!"
)

async def synthesize(text, out_voice_path):
    print(f"Sintetizando: {out_voice_path}...")
    comm = edge_tts.Communicate(
        text=text,
        voice="pt-BR-ThalitaMultilingualNeural",
        rate="+3%", # leve aceleração natural para ad
        pitch="+0Hz"
    )
    await comm.save(out_voice_path)

def mix(voice_file, final_audio_file, target_duration_sec, bgm_file):
    fade_start = max(1.0, target_duration_sec - 2.5)
    
    # 1. Gera BGM no tempo exato
    filter_graph = (
        f"sine=frequency=220:duration={target_duration_sec}[s1];"
        f"sine=frequency=330:duration={target_duration_sec}[s2];"
        f"sine=frequency=440:duration={target_duration_sec}[s3];"
        f"[s1][s2][s3]amix=inputs=3[chords];"
        f"[chords]volume=0.05,lowpass=f=450,afade=t=in:st=0:d=1,afade=t=out:st={fade_start:.2f}:d=2.5[out]"
    )
    cmd_bgm = [
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", f"anoisesrc=d={target_duration_sec}:c=pink:r=44100:a=0.005",
        "-filter_complex", filter_graph,
        "-map", "[out]",
        "-c:a", "libmp3lame",
        "-b:a", "192k",
        bgm_file
    ]
    subprocess.run(cmd_bgm, check=True)

    # 2. Mix voz + BGM
    mix_filter = (
        f"[0:a]volume=1.35[v];"
        f"[1:a]volume=0.22,afade=t=in:st=0:d=0.8,afade=t=out:st={fade_start:.2f}:d=2[b];"
        f"[v][b]amix=inputs=2:duration=first:dropout_transition=2[out]"
    )
    cmd_mix = [
        "ffmpeg", "-y",
        "-i", voice_file,
        "-i", bgm_file,
        "-filter_complex", mix_filter,
        "-map", "[out]",
        "-c:a", "libmp3lame",
        "-b:a", "192k",
        final_audio_file
    ]
    subprocess.run(cmd_mix, check=True)
    print(f"Finalizado: {final_audio_file}")

async def main():
    # 15 Segundos
    v15 = os.path.join(OUT_DIR, 'raw_v15.mp3')
    bgm15 = os.path.join(OUT_DIR, 'bgm15.mp3')
    final15 = os.path.join(OUT_DIR, 'audio_meta_ads_15s.mp3')
    await synthesize(SCRIPT_15S, v15)
    mix(v15, final15, 15.0, bgm15)

    # 30 Segundos
    v30 = os.path.join(OUT_DIR, 'raw_v30.mp3')
    bgm30 = os.path.join(OUT_DIR, 'bgm30.mp3')
    final30 = os.path.join(OUT_DIR, 'audio_meta_ads_30s.mp3')
    await synthesize(SCRIPT_30S, v30)
    mix(v30, final30, 30.0, bgm30)

    print("Áudios de 15s e 30s gerados e mixados com sucesso!")

if __name__ == '__main__':
    asyncio.run(main())
