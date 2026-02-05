import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

const EMBEDDED = '_embedded';

/**
 * User model
 */
export class UserModel extends BaseApiModel {
  static readonly RANK_NEWBIE = 'newbie';
  static readonly RANK_CANDIDATE = 'candidate';
  static readonly RANK_MASTER = 'master';

  static readonly USER_RANKS = [
    UserModel.RANK_NEWBIE,
    UserModel.RANK_CANDIDATE,
    UserModel.RANK_MASTER,
  ];

  static readonly ROLE = 'role';
  static readonly GROUP = 'group';
  static readonly AMOJO_ID = 'amojo_id';
  static readonly UUID = 'uuid';
  static readonly USER_RANK = 'user_rank';
  static readonly PHONE_NUMBER = 'phone_number';

  protected id: number | null = null;
  protected uuid: string | null = null;
  protected name: string | null = null;
  protected amojoId: string | null = null;
  protected email: string | null = null;
  protected lang: string | null = null;
  protected rights: Record<string, unknown> | null = null;
  protected roles: Record<string, unknown>[] | null = null;
  protected groups: Record<string, unknown>[] | null = null;
  protected password: string | null = null;
  protected rank: string | null = null;
  protected phoneNumber: string | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getUuid() { return this.uuid; }
  setUuid(uuid: string | null) { this.uuid = uuid; return this; }
  getName() { return this.name; }
  setName(name: string | null) { this.name = name; return this; }
  getAmojoId() { return this.amojoId; }
  setAmojoId(amojoId: string | null) { this.amojoId = amojoId; return this; }
  getEmail() { return this.email; }
  setEmail(email: string | null) { this.email = email; return this; }
  getLang() { return this.lang; }
  setLang(lang: string | null) { this.lang = lang; return this; }
  getRights() { return this.rights; }
  setRights(rights: Record<string, unknown> | null) { this.rights = rights; return this; }
  getRoles() { return this.roles; }
  setRoles(roles: Record<string, unknown>[] | null) { this.roles = roles; return this; }
  getGroups() { return this.groups; }
  setGroups(groups: Record<string, unknown>[] | null) { this.groups = groups; return this; }
  getPassword() { return this.password; }
  setPassword(password: string | null) { this.password = password; return this; }
  getRank() { return this.rank; }
  setRank(rank: string | null) { this.rank = rank; return this; }
  getPhoneNumber() { return this.phoneNumber; }
  setPhoneNumber(phoneNumber: string | null) { this.phoneNumber = phoneNumber; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  static getAvailableWith(): string[] {
    return [
      UserModel.ROLE,
      UserModel.UUID,
      UserModel.GROUP,
      UserModel.AMOJO_ID,
      UserModel.USER_RANK,
      UserModel.PHONE_NUMBER,
    ];
  }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('User id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['name'] !== undefined) this.setName(data['name'] as string | null);
    if (data['email'] !== undefined) this.setEmail(data['email'] as string | null);
    if (data['lang'] !== undefined) this.setLang(data['lang'] as string | null);
    if (data['uuid'] !== undefined) this.setUuid(data['uuid'] as string | null);
    if (data['amojo_id'] !== undefined) this.setAmojoId(data['amojo_id'] as string | null);
    if (data['user_rank'] !== undefined) this.setRank(data['user_rank'] as string | null);
    if (data['phone_number'] !== undefined) this.setPhoneNumber(data['phone_number'] as string | null);
    if (data['rights']) this.setRights(data['rights'] as Record<string, unknown>);

    const embedded = data[EMBEDDED] as Record<string, unknown> | undefined;
    if (embedded) {
      if (embedded['groups']) this.setGroups(embedded['groups'] as Record<string, unknown>[]);
      if (embedded['roles']) this.setRoles(embedded['roles'] as Record<string, unknown>[]);
    }

    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      lang: this.lang,
      uuid: this.uuid,
      amojo_id: this.amojoId,
      rights: this.rights,
      roles: this.roles,
      groups: this.groups,
      user_rank: this.rank,
      phone_number: this.phoneNumber,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (this.name !== null) result['name'] = this.name;
    if (this.email !== null) result['email'] = this.email;
    if (this.password !== null) result['password'] = this.password;
    if (this.rights !== null) result['rights'] = this.rights;

    if (this.requestId === null && requestId !== null && requestId !== undefined) {
      this.requestId = String(requestId);
    }

    result['request_id'] = this.requestId;

    return result;
  }
}
