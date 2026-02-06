import { BaseApiModel } from './BaseApiModel';
import { InvalidArgumentException } from '../Exceptions/InvalidArgumentException';

const EMBEDDED = '_embedded';

/**
 * Role model
 */
export class RoleModel extends BaseApiModel {
  static readonly USERS = 'users';

  protected id: number | null = null;
  protected name: string | null = null;
  protected users: Record<string, unknown>[] | null = null;
  protected rights: Record<string, unknown> | null = null;
  protected requestId: string | null = null;

  getId() { return this.id; }
  setId(id: number) { this.id = id; return this; }
  getName() { return this.name; }
  setName(name: string) { this.name = name; return this; }
  getUsers() { return this.users; }
  setUsers(users: Record<string, unknown>[] | null) { this.users = users; return this; }
  getRights() { return this.rights; }
  setRights(rights: Record<string, unknown> | null) { this.rights = rights; return this; }
  getRequestId() { return this.requestId; }
  setRequestId(id: string | null) { this.requestId = id; return this; }

  static getAvailableWith(): string[] {
    return [RoleModel.USERS];
  }

  fromArray(data: Record<string, unknown>): this {
    if (!data['id']) {
      throw new InvalidArgumentException('Role id is empty in ' + JSON.stringify(data));
    }
    this.setId(Number(data['id']));
    if (data['name']) this.setName(String(data['name']));
    if (data['rights']) this.setRights(data['rights'] as Record<string, unknown>);

    const embedded = data[EMBEDDED] as Record<string, unknown> | undefined;
    if (embedded) {
      if (embedded['users']) this.setUsers(embedded['users'] as Record<string, unknown>[]);
    }

    return this as this;
  }

  toArray(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      rights: this.rights,
      users: this.users,
    };
  }

  toApi(requestId?: string | number | null): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    if (this.name !== null) result['name'] = this.name;
    if (this.rights !== null) result['rights'] = this.rights;

    if (this.requestId === null && requestId !== null && requestId !== undefined) {
      this.requestId = String(requestId);
    }

    result['request_id'] = this.requestId;

    return result;
  }
}
