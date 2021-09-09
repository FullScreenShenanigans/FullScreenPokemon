import { expect } from "chai";

import { stubBlankGame } from "../fakes.test";

import { Character } from "./Actors";

describe("Collisions", () => {
    describe("isCharacterTouchingCharacter", () => {
        const stubCharacterType: [string, any] = [
            "Lady",
            {
                width: 8,
                height: 12,
            },
        ];

        it("returns true when characters are touching", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const isCharacterTouchingCharacter = fsp.collisions.generateIsCharacterTouchingCharacter();
            const a = fsp.actors.add<Character>(stubCharacterType);
            const b = fsp.actors.add<Character>(stubCharacterType);

            fsp.physics.setTop(b, a.bottom);

            // Act
            const touching: boolean = isCharacterTouchingCharacter(a, b);

            // Assert
            expect(touching).to.be.equal(true);
        });

        it("returns false when characters aren't touching", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const isCharacterTouchingCharacter = fsp.collisions.generateIsCharacterTouchingCharacter();
            const a = fsp.actors.add<Character>(stubCharacterType);
            const b = fsp.actors.add<Character>(stubCharacterType);

            fsp.physics.setTop(b, a.bottom + 28);

            // Act
            const touching: boolean = isCharacterTouchingCharacter(a, b);

            // Assert
            expect(touching).to.be.equal(false);
        });

        it("returns false when a character is following another", (): void => {
            // Arrange
            const { fsp } = stubBlankGame();
            const isCharacterTouchingCharacter = fsp.collisions.generateIsCharacterTouchingCharacter();
            const a = fsp.actors.add<Character>(stubCharacterType);
            const b = fsp.actors.add<Character>(stubCharacterType);

            fsp.physics.setTop(b, a.bottom);
            fsp.actions.following.startFollowing(b, a);

            // Act
            const touching: boolean = isCharacterTouchingCharacter(a, b);

            // Assert
            expect(touching).to.be.equal(false);
        });
    });
});
