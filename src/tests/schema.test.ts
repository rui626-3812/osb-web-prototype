/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, test, expect } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data_store.json');

describe('Data Store Schema Validation', () => {

  test('should load data_store.json and confirm basic fields', async () => {
    const rawData = await fs.readFile(DB_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    // root-level requirements
    expect(data).toHaveProperty('schedulePassword');
    expect(typeof data.schedulePassword).toBe('string');
    
    // titles schema
    expect(data).toHaveProperty('titles');
    expect(data.titles).toHaveProperty('brandName');
    expect(data.titles).toHaveProperty('brandSubtitle');
    expect(data.titles).toHaveProperty('teamTitle');
    expect(data.titles).toHaveProperty('eventsTitle');
    expect(data.titles).toHaveProperty('resourcesTitle');
    expect(data.titles).toHaveProperty('faqsTitle');

    // intro schema
    expect(data).toHaveProperty('intro');
    expect(data.intro).toHaveProperty('title');
    expect(data.intro).toHaveProperty('subtitle');
    expect(data.intro).toHaveProperty('description');

    // lists existence
    expect(data).toHaveProperty('members');
    expect(Array.isArray(data.members)).toBe(true);

    expect(data).toHaveProperty('alumniList');
    expect(Array.isArray(data.alumniList)).toBe(true);

    expect(data).toHaveProperty('events');
    expect(Array.isArray(data.events)).toBe(true);

    expect(data).toHaveProperty('resources');
    expect(Array.isArray(data.resources)).toBe(true);

    expect(data).toHaveProperty('faqs');
    expect(Array.isArray(data.faqs)).toBe(true);
  });

  test('should validate member properties inside storage', async () => {
    const rawData = await fs.readFile(DB_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    if (data.members.length > 0) {
      const member = data.members[0];
      expect(member).toHaveProperty('id');
      expect(member).toHaveProperty('name');
      expect(member).toHaveProperty('role');
      expect(member).toHaveProperty('specialty');
      expect(member).toHaveProperty('achievements');
      expect(Array.isArray(member.achievements)).toBe(true);
    }
  });

  test('should validate event properties inside storage', async () => {
    const rawData = await fs.readFile(DB_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    if (data.events.length > 0) {
      const event = data.events[0];
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('type');
      expect(event).toHaveProperty('date');
      expect(event).toHaveProperty('time');
      expect(event).toHaveProperty('location');
      expect(event).toHaveProperty('description');
    }
  });

});
