const express = require('express')
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const jwt = require('jsonwebtoken')
const User = require('@launchr/db/models/User')

const router = express.Router()

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/api/auth/github/callback',
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOneAndUpdate(
      { githubId: profile.id },
      {
        githubId: profile.id,
        username: profile.username,
        avatarUrl: profile.photos[0].value,
        githubToken: accessToken,
        email: profile.emails?.[0]?.value || ''
      },
      { upsert: true, new: true }
    )
    done(null, user)
    } catch (error) {
        done(error, null)
    }
}))

router.get('/github', passport.authenticate('github'))

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id },
    process.env.JWT_SECRET,
  { expiresIn: '30d' })
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
  }
)

module.exports = router