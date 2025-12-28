
import { GoogleGenAI, Type } from "@google/genai";
import { UserData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const WRAPPED_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    username: { type: Type.STRING },
    generatedRank: { type: Type.STRING, description: "Kullanıcıya özel uydurulmuş eğlenceli bir rütbe (örn: 'Yılın iTrader Rekortmeni', 'Konu Baltalama Uzmanı')" },
    realStats: {
      type: Type.OBJECT,
      properties: {
        tradeCount: { type: Type.STRING },
        rank: { type: Type.STRING },
        joinDate: { type: Type.STRING },
        memberId: { type: Type.STRING },
        totalPosts: { type: Type.STRING }
      },
      required: ["tradeCount", "rank", "joinDate"]
    },
    insights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          emoji: { type: Type.STRING },
          bgColor: { type: Type.STRING },
          textColor: { type: Type.STRING },
          accentColor: { type: Type.STRING }
        },
        required: ["title", "content", "emoji", "bgColor", "textColor", "accentColor"]
      }
    }
  },
  required: ["username", "generatedRank", "realStats", "insights"]
};

export const generateR10Wrapped = async (profileUrl: string): Promise<UserData> => {
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    Sen r10.net forumu konusunda uzmanlaşmış profesyonel bir veri analistisin. 
    GÖREVİN: ${profileUrl} adresindeki r10 profilini Google Search kullanarak detaylıca incelemek ve 2025 YILI ÖZETİ (WRAPPED) hazırlamak.
    
    GERÇEK VERİ TOPLAMA KURALLARI:
    - Kullanıcının iTrader (Ticaret Puanı) değerini bul.
    - Forum rütbesini (Kurumsal Plus, Platin, Altın, Standart vb.) tespit et.
    - Üyelik tarihini ve üye ID'sini (eskiliğini) kontrol et.
    - En çok hangi kategorilerde ticaret yaptığını veya yazdığını belirle (SEO, Adsense, Domain vb.).

    İÇERİK PLANI (15-18 SLAYT):
    1. Giriş: "İşte senin efsanevi 2025 r10 özetin!"
    2. Kimlik Kartı: Gerçek rütbe ve üyelik yılı.
    3. Ticaret Karnesi: iTrader sayısı ve forumdaki ticari güvenilirliği.
    4. Sektör Hakimiyeti: En aktif olduğu ana kategori.
    5. Gece Kuşu mu? Mesai Saati mi? (Yazım sıklığı tahmini).
    6. iTrader Rekoru: 2025'teki ticari başarısı.
    7. Forum Kıdemi: Kaç yıldır buralarda olduğunu kutla.
    8. Üye ID Analizi: "Sen buraların kurucu babalarındansın" veya "Hızlı yükselen yıldız" gibi yorumlar.
    9. Jargon Slaytı: "PM atıldı", "Hayırlı satışlar" gibi r10 terimleriyle süslü bir analiz.
    10. Vizyon: "2025'in en çok kazandıran ismi sensin".
    11. Mizah Slaytı: "Konu baltalama ihtimalin %1" gibi şaka içerikleri.
    12. Market Değeri: Tahmini ticari hacim yorumu.
    13. Forum Arketipleri: "SEO Büyücüsü", "Backlink Lordu", "Domain Avcısı" vb.
    14. 2025 Başarısı: Yılın en iyi anı.
    15. Büyük Final: Ona özel "EĞLENCELİ RÜTBE" ver (Örn: R10 CEO'su Yedeği, iTrader İmparatoru).
    16-18. Özet ve Teşekkür slaytları.

    STİL:
    - Host Grotesk fontu, BOLD, BÜYÜK HARF.
    - Spotify Wrapped estetiği (Canlı, kontrast, neon renkler).
    - Jargon: r10 jargonunu (Konu kilit, hayırlı satışlar, ref, itrader) eksiksiz kullan.
    - Kesinlikle 2025 yılına odaklan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: WRAPPED_SCHEMA as any,
      },
    });

    const data = JSON.parse(response.text);
    return {
      username: data.username,
      profileUrl: profileUrl,
      generatedRank: data.generatedRank,
      insights: data.insights
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Veriler çekilemedi. Profil linkinin doğru ve herkese açık olduğundan emin olun.");
  }
};
