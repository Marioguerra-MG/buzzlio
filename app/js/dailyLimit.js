/******************************************************
 * Módulo: dailyLimit
 * Descrição: Gerencia o limite diário de gerações por
 * categoria para usuários grátis. Salva e recupera
 * os dados do localStorage.
 ******************************************************/

// Prefixo usado para salvar dados no localStorage
const STORAGE_PREFIX = 'gmc_';

/******************************************************
 * Função: todayStr
 * Descrição: Retorna a data atual no formato YYYY-MM-DD
 ******************************************************/
export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

/******************************************************
 * Função: getDailyByCategory
 * Descrição: Retorna os dados de uso diário por categoria.
 * Se os dados não existirem ou forem de outro dia, retorna
 * um objeto inicializado com a data atual e categorias vazias.
 ******************************************************/
export function getDailyByCategory() {
  try {
    // Pega os dados do localStorage
    const raw = localStorage.getItem(STORAGE_PREFIX + 'dailyByCat');
    // Converte JSON para objeto ou cria objeto vazio
    const data = raw ? JSON.parse(raw) : {};

    // Se a data armazenada não é a de hoje, reseta categorias
    if (data.date !== todayStr()) {
      return { date: todayStr(), categories: {} };
    }

    // Retorna os dados existentes válidos
    return data;
  } catch {
    // Se der algum erro (JSON inválido, etc.), retorna objeto inicial
    return { date: todayStr(), categories: {} };
  }
}

/******************************************************
 * Função: saveDailyByCategory
 * Descrição: Salva o objeto de uso diário por categoria
 * no localStorage como JSON.
 ******************************************************/
export function saveDailyByCategory(obj) {
  localStorage.setItem(STORAGE_PREFIX + 'dailyByCat', JSON.stringify(obj));
}
