import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { gameUsernameState } from '~/atoms/game';
import AppSettingsDrawer from '~/components/AppSettingsDrawer';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import SinglePlayLayout from '~/layout/SinglePlayLayout';

import {
  ActionRow,
  Hero,
  InputGroup,
  PreviewBoard,
  PreviewTile,
  RuleNote,
  SecondaryButton,
  StartPanel,
  Tagline,
  Title,
  TitleGroup,
  Wrapper,
} from './styles';

const previewTiles = [
  'blue', 'cyan', 'orange', 'green', 'purple', 'pink',
  'cyan', 'cyan', 'orange', 'green', 'green', 'pink',
  'blue', 'orange', 'orange', 'purple', 'green', 'pink',
  'blue', 'blue', 'cyan', 'purple', 'purple', 'orange',
] as const;

const guestNames = ['Tile Rookie', 'Combo Maker', 'Pop Starter', 'Puzzle Buddy'];

const IndexPage = () => {
  const [name, setName] = useRecoilState(gameUsernameState);
  const [storedName, setStoredName] = useLocalStorage('username', '');

  const setPlayerName = (value: string) => {
    setStoredName(value);
    setName(value);
  };

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPlayerName(e.target.value);
  };

  const onRandomNameClick = () => {
    const index = Math.floor(Math.random() * guestNames.length);
    setPlayerName(guestNames[index]);
  };

  useEffect(() => {
    setName(storedName);
  }, [setName, storedName]);

  return (
    <SinglePlayLayout>
      <AppSettingsDrawer />
      <Wrapper>
        <Hero>
          <PreviewBoard aria-hidden="true">
            {previewTiles.map((tile, index) => (
              <PreviewTile
                key={`${tile}-${index}`}
                color={tile}
                selected={index === 7 || index === 8 || index === 14}
              />
            ))}
          </PreviewBoard>
          <TitleGroup>
            <Title>POPTILE</Title>
            <Tagline>같은 타일을 빠르게 터뜨려 최고 점수에 도전하세요.</Tagline>
          </TitleGroup>
        </Hero>

        <StartPanel>
          <InputGroup>
            <Input
              type={'text'}
              placeholder={'플레이어 이름'}
              value={name}
              onChange={onNameChange}
              aria-label={'플레이어 이름'}
            />
            <SecondaryButton type={'button'} onClick={onRandomNameClick}>
              랜덤 이름
            </SecondaryButton>
          </InputGroup>
          <ActionRow>
            <Link to={'/single'}>
              <Button color={'blue'} disabled={name.trim().length === 0}>시작하기</Button>
            </Link>
            <Link to={'/single/leaderboard'}>
              <Button color={'cyan'}>순위표</Button>
            </Link>
          </ActionRow>
        </StartPanel>

        <RuleNote>연결된 타일을 누르면 점수가 올라갑니다. 적은 터치로 높은 점수를 만드는 것이 핵심입니다.</RuleNote>
      </Wrapper>
    </SinglePlayLayout>
  );
};

export default IndexPage;
