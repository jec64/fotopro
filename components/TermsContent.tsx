import React from 'react';

export const TermsContent: React.FC = () => {
  return (
    <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
      <section>
        <h3 className="text-lg font-bold text-white mb-2">📜 1. TERMOS DE USO – VERSÃO COMPLETA (LGPD + MARCO CIVIL)</h3>
        
        <h4 className="font-bold text-primary mt-2">1. Aceitação</h4>
        <p>Ao utilizar a FOTOPRO, o usuário declara que: Leu, Compreendeu e Concorda integralmente com estes Termos. Caso não concorde, deve cessar imediatamente o uso.</p>

        <h4 className="font-bold text-primary mt-2">2. Cadastro e Dados Financeiros (CPF)</h4>
        <p>Para cumprimento das regulações bancárias do Banco Central do Brasil referente a pagamentos instantâneos (Pix), <strong>é obrigatório o fornecimento do CPF (Cadastro de Pessoas Físicas)</strong> válido do titular da conta no momento da assinatura de planos pagos.</p>
        <p>O CPF será utilizado EXCLUSIVAMENTE para a emissão da cobrança e validação antifraude junto à instituição de pagamento parceira. Este dado é armazenado de forma criptografada e não é compartilhado com terceiros para fins de marketing.</p>

        <h4 className="font-bold text-primary mt-2">3. Descrição do Serviço</h4>
        <p>A FOTOPRO é uma plataforma digital que oferece: Melhoria de fotos por IA, Geração de imagens por IA, Alteração de fundo e Otimização visual. O serviço é fornecido “como está”, sem garantias de resultado.</p>

        <h4 className="font-bold text-primary mt-2">4. Elegibilidade</h4>
        <p>Uso permitido apenas para maiores de 18 anos. O usuário declara ter capacidade legal. É proibido o uso por menores.</p>

        <h4 className="font-bold text-primary mt-2">5. Uso Proibido (CLÁUSULA FORTE)</h4>
        <p>É terminantemente proibido: Conteúdo pornográfico, Nudez sexual, Qualquer conteúdo envolvendo menores, Conteúdo ilegal, criminoso ou fraudulento, Violação de direitos autorais, Deepfake, difamação ou manipulação enganosa.</p>
        <p className="mt-1 font-semibold text-red-400">🚨 Fiscalização e Providências</p>
        <p>A FOTOPRO: Utiliza sistemas automáticos de detecção, Pode revisar conteúdos manualmente, Pode bloquear, suspender ou excluir contas, Pode registrar logs e evidências, Pode comunicar autoridades competentes, conforme lei.</p>

        <h4 className="font-bold text-primary mt-2">6. Responsabilidade do Usuário</h4>
        <p>O usuário é inteiramente responsável pelo conteúdo enviado, uso das imagens e consequências legais.</p>

        <h4 className="font-bold text-primary mt-2">7. Planos, Pagamentos e Cancelamento</h4>
        <p>Pagamentos não são reembolsáveis. A renovação é manual ou automática dependendo do método. O plano expira automaticamente após 30 dias caso não haja renovação.</p>

        <h4 className="font-bold text-primary mt-2">8. Propriedade Intelectual</h4>
        <p>O usuário mantém direitos sobre suas imagens. A FOTOPRO não assume propriedade. Marca, código e tecnologia pertencem à FOTOPRO.</p>

        <h4 className="font-bold text-primary mt-2">9. Limitação Máxima de Responsabilidade</h4>
        <p>A FOTOPRO não se responsabiliza, em nenhuma hipótese, por: Danos diretos ou indiretos, Lucros cessantes, Uso indevido das imagens, Conteúdos gerados ou processados.</p>

        <h4 className="font-bold text-primary mt-2">10. Guarda de Registros (Marco Civil)</h4>
        <p>Conforme o Marco Civil da Internet (Lei 12.965/2014), a FOTOPRO poderá: Armazenar registros de acesso, Preservar logs mediante ordem judicial, Cooperar com autoridades.</p>

        <h4 className="font-bold text-primary mt-2">11. Foro</h4>
        <p>Fica eleito o foro da comarca de São Paulo/SP, conforme legislação brasileira.</p>
      </section>

      <div className="w-full h-px bg-white/10 my-4"></div>

      <section>
        <h3 className="text-lg font-bold text-white mb-2">🔐 2. POLÍTICA DE PRIVACIDADE – LGPD</h3>
        <p><strong>1. Base Legal:</strong> Tratamento de dados conforme LGPD (Lei 13.709/2018) e Marco Civil da Internet.</p>
        <p><strong>2. Dados Coletados:</strong> Dados cadastrais, CPF (para emissão de nota e Pix), Dados de uso, Imagens enviadas, Endereço IP e logs.</p>
        <p><strong>3. Finalidade:</strong> Prestação do serviço, Segurança, Prevenção a fraudes, Cumprimento legal.</p>
        <p><strong>4. Retenção:</strong> Dados mantidos pelo tempo necessário ao serviço e prazo legal exigido.</p>
        <p><strong>5. Direitos do Titular:</strong> O usuário pode solicitar: Acesso, Correção, Exclusão, Portabilidade, Revogação de consentimento.</p>
        <p><strong>6. Segurança:</strong> Utilizamos medidas técnicas e administrativas para proteger dados.</p>
      </section>
    </div>
  );
};