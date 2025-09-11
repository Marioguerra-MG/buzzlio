/******************************************************
 * Premium Management
 * Funções para checar, ativar e gerenciar o status
 * do usuário premium.
 ******************************************************/

const STORAGE_PREFIX = 'gmc_'; // prefixo usado para armazenar dados no localStorage

// ===== Verifica se o usuário é premium =====
export function isPremium() {
  const raw = localStorage.getItem(STORAGE_PREFIX + 'premiumData'); // pega dados do localStorage
  if (!raw) return false; // se não houver dados, usuário não é premium

  try {
    const obj = JSON.parse(raw);
    // se o tempo expirou, remove os dados e retorna false
    if (Date.now() > obj.expires) {
      localStorage.removeItem(STORAGE_PREFIX + 'premiumData');
      return false;
    }
    return true; // premium ativo
  } catch {
    return false; // caso JSON inválido
  }
}

// ===== Ativa premium por 30 dias =====
export function ativarPremium() {
  const expires = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 dias em milissegundos
  localStorage.setItem(STORAGE_PREFIX + 'premiumData', JSON.stringify({ expires }));
}

// ===== Retorna quanto tempo resta do premium =====
export function getPremiumRemaining() {
  const raw = localStorage.getItem(STORAGE_PREFIX + 'premiumData');
  if (!raw) return null;

  const obj = JSON.parse(raw);
  const diff = obj.expires - Date.now();
  if (diff <= 0) return null; // premium expirado

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24)); // dias restantes
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24); // horas restantes
  return { dias, horas };
}
