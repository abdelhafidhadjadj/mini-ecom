import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { registerB2B } from '$lib/server/auth-b2b';
import { query } from '$lib/server/db';

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get('session_b2b');
  if (token) {
    throw redirect(302, '/b2b');
  }

  const typesClient = await query(`
    SELECT id, code, nom, description, remise_defaut
    FROM types_client
    WHERE code != 'public' AND actif = TRUE
    ORDER BY ordre ASC
  `);

  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
    'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
    'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
    'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
    'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arreridj',
    'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
    'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal',
    'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa'
  ];

  return { typesClient, wilayas };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const nom_entreprise = data.get('nom_entreprise')?.toString().trim();
    const contact_nom = data.get('contact_nom')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const telephone = data.get('telephone')?.toString().trim();
    const password = data.get('password')?.toString();
    const password_confirm = data.get('password_confirm')?.toString();
    const type_client_code = data.get('type_client_code')?.toString();
    const wilaya = data.get('wilaya')?.toString();
    const adresse = data.get('adresse')?.toString().trim();
    const siret = data.get('siret')?.toString().trim();

    if (!nom_entreprise || !contact_nom || !email || !telephone || !password || !type_client_code || !wilaya) {
      return fail(400, {
        error: 'All required fields must be filled',
        nom_entreprise, contact_nom, email, telephone, wilaya, adresse, siret, type_client_code
      });
    }

    if (password !== password_confirm) {
      return fail(400, {
        error: 'Passwords do not match',
        nom_entreprise, contact_nom, email, telephone, wilaya, adresse, siret, type_client_code
      });
    }

    if (password.length < 8) {
      return fail(400, {
        error: 'Password must be at least 8 characters',
        nom_entreprise, contact_nom, email, telephone, wilaya, adresse, siret, type_client_code
      });
    }

    try {
      await registerB2B({
        nom_entreprise,
        contact_nom,
        email,
        telephone,
        password,
        type_client_code,
        wilaya,
        adresse,
        siret,
      });

    } catch (err: any) {
      // Handle specific errors
      if (err.message === 'EMAIL_EXISTS') {
        return fail(400, {
          error: 'This email is already registered',
          nom_entreprise, contact_nom, email, telephone, wilaya, adresse, siret, type_client_code
        });
      }

      console.error('[B2B Register] Error:', err.message);
      return fail(500, {
        error: 'Server error, please try again',
        nom_entreprise, contact_nom, email, telephone, wilaya, adresse, siret, type_client_code
      });
    }

    // Success - redirect OUTSIDE the try-catch
    throw redirect(302, '/b2b-auth/register/success');
  },
};