/* @flow */
import { Service } from './service'
import cheerio from 'cheerio'

class Instagram extends Service {
  static getBaseUrls() {
    const baseUrls = ['https://www.instagram.com/', 'https://instagram.com/']
    return baseUrls
  }

  static getProofUrl(proof: Object) {
    const baseUrls = this.getBaseUrls()
    const normalizedProofUrl = this.normalizeInstagramUrl(proof)

    for (let i = 0; i < baseUrls.length; i++) {
      if (normalizedProofUrl.startsWith(`${baseUrls[i]}`)) {
        return normalizedProofUrl
      }
    }
    throw new Error(`Proof url ${proof.proof_url} is not valid for service ${proof.service}`)
  }

  static normalizeInstagramUrl(proof: Object) {
    let proofUrl = proof.proof_url

    if (proofUrl.startsWith('http://')) {
      const tokens = proofUrl.split('http://')
      proofUrl = `https://${tokens[1]}`
    }

    if (proofUrl.startsWith('https://instagram.com')) {
      const tokens = proofUrl.split('https://instagram.com')
      proofUrl = `https://www.instagram.com${tokens[1]}`
    }

    return proofUrl
  }

  static shouldValidateIdentityInBody() {
    return true
  }

  static getProofIdentity(searchText: string) {
    const $ = cheerio.load(searchText)
    const username = $('meta[property="og:description"]').attr('content')
    if (username !== undefined && username.split(':').length > 1) {
      return username.split(':')[0].match(/\(([^)]+)\)/)[1].substr(1)
    } else {
      return ''
    }
  }

  static getProofStatement(searchText: string) {
    const $ = cheerio.load(searchText)
    const statement = $('meta[property="og:description"]')
                        .attr('content')

    if (statement !== undefined && statement.split(':').length > 1) {
      return statement.split(':')[1].trim().replace('“', '').replace('”', '')
    } else {
      return ''
    }
  }
}

export { Instagram }