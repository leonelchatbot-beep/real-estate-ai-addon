import type { IntentType } from '@reaa/shared';

export function buildHandoffMessage(intent: IntentType) {
  switch (intent) {
    case 'seller':
      return '¡Gracias! Ya le paso esta info a una asesora para que te contacte y puedan avanzar con la tasación.';
    case 'recruiting':
      return '¡Gracias! Ya te paso el link para que cargues tu CV y te contacte uno de los brokers de la oficina para coordinar una entrevista.';
    case 'rent_temporary':
      return 'Ya tomé nota de tu búsqueda. Un asesor se va a poner en contacto con vos a la brevedad para ayudarte con opciones de alquiler temporal.';
    case 'existing_customer':
      return 'Gracias por escribirnos. Ya le paso tu consulta a una asesora para que te contacte a la brevedad.';
    default:
      return 'Ya tomé nota de tus requerimientos. Un asesor se va a poner en contacto con vos a la brevedad para ayudarte con tu búsqueda.';
  }
}
